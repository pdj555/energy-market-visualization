package com.energymarket.market.generator;

import com.energymarket.market.MarketCode;
import com.energymarket.market.MarketCode.MarketParameters;
import com.energymarket.market.model.ForecastPoint;
import com.energymarket.market.model.MarketInsights;
import com.energymarket.market.model.MarketOverview;
import com.energymarket.market.model.MarketSnapshot;
import com.energymarket.market.model.PricePoint;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

/**
 * Generates deterministic, high-signal synthetic market data suitable for advanced UI demos.
 */
public class MarketDataGenerator {

  private static final double MIN_PRICE = 20.0;
  private static final double MIN_DEMAND_FACTOR = 0.5;
  private static final double MIN_RENEWABLE_SHARE = 5.0;
  private static final double MAX_RENEWABLE_SHARE = 95.0;
  private static final double MIN_CARBON_INTENSITY = 80.0;

  /**
   * Builds a full dashboard snapshot including historical series, forecast and analytics.
   */
  public MarketSnapshot generateSnapshot(
      MarketCode market,
      Instant now,
      Duration historyRange,
      Duration historyInterval,
      Duration forecastHorizon,
      Duration forecastInterval) {
    MarketContext context = buildContext(market, now, historyRange, historyInterval);
    List<ForecastPoint> forecast =
        buildForecast(
            market,
            context.history(),
            forecastHorizon,
            forecastInterval,
            context.insights().priceStandardDeviation());
    return new MarketSnapshot(context.overview(), context.history(), forecast, context.insights());
  }

  /** Returns a top-level overview for quick market comparisons. */
  public MarketOverview generateOverview(
      MarketCode market, Instant now, Duration historyRange, Duration historyInterval) {
    return buildContext(market, now, historyRange, historyInterval).overview();
  }

  private MarketContext buildContext(
      MarketCode market, Instant now, Duration historyRange, Duration historyInterval) {
    List<PricePoint> history = buildHistoricalSeries(market, now, historyRange, historyInterval);
    MarketInsights insights = buildInsights(market, history);
    MarketOverview overview = buildOverview(market, history, insights);
    return new MarketContext(overview, history, insights);
  }

  private List<PricePoint> buildHistoricalSeries(
      MarketCode market, Instant now, Duration range, Duration interval) {
    validateDurations(range, interval, "history");
    long rangeMinutes = range.toMinutes();
    long intervalMinutes = interval.toMinutes();
    int steps = Math.toIntExact(rangeMinutes / intervalMinutes);

    Instant start = now.minus(range);
    ZoneId zoneId = ZoneId.of(market.timezone());
    MarketParameters parameters = market.parameters();
    List<PricePoint> series = new ArrayList<>(steps + 1);

    for (int i = 0; i <= steps; i++) {
      Instant timestamp = start.plus(interval.multipliedBy(i));
      ZonedDateTime zoned = timestamp.atZone(zoneId);
      double minutesOfDay = zoned.getHour() * 60.0 + zoned.getMinute();
      double dayProgress = minutesOfDay / (24.0 * 60.0);
      double weekProgress =
          ((double) (zoned.getDayOfWeek().getValue() - 1) + dayProgress) / 7.0;
      double hoursFromStart = (intervalMinutes * i) / 60.0;
      double noise = computeNoise(timestamp, market.ordinal());

      double price =
          computePrice(parameters, hoursFromStart, dayProgress, weekProgress, noise);
      double demand =
          computeDemand(parameters, hoursFromStart, dayProgress, weekProgress, price, noise);
      double renewables =
          computeRenewables(parameters, hoursFromStart, dayProgress, weekProgress, noise);
      double carbon = computeCarbon(parameters, demand, renewables);

      series.add(
          new PricePoint(
              timestamp,
              round(price, 2),
              round(demand, 0),
              round(carbon, 1),
              round(renewables, 1)));
    }

    series.sort(Comparator.comparing(PricePoint::timestamp));
    return List.copyOf(series);
  }

  private MarketInsights buildInsights(MarketCode market, List<PricePoint> history) {
    Objects.requireNonNull(market, "market");
    Objects.requireNonNull(history, "history");
    if (history.isEmpty()) {
      throw new IllegalArgumentException("history must contain at least one point");
    }

    PricePoint first = history.getFirst();
    PricePoint last = history.getLast();

    double priceSum = 0.0;
    double priceSquareSum = 0.0;
    double minPrice = Double.MAX_VALUE;
    double maxPrice = Double.MIN_VALUE;
    double demandSum = 0.0;
    double peakDemand = Double.MIN_VALUE;
    double renewableSum = 0.0;

    for (PricePoint point : history) {
      double price = point.priceMwh();
      priceSum += price;
      priceSquareSum += price * price;
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);

      double demand = point.demandMw();
      demandSum += demand;
      peakDemand = Math.max(peakDemand, demand);

      renewableSum += point.renewablesShare();
    }

    int count = history.size();
    double averagePrice = priceSum / count;
    double variance = Math.max(0.0, priceSquareSum / count - averagePrice * averagePrice);
    double priceStdDev = Math.sqrt(variance);
    double averageDemand = demandSum / count;
    double averageRenewables = renewableSum / count;
    double hoursBetween =
        Math.max(
            1.0,
            Duration.between(first.timestamp(), last.timestamp()).toMinutes() / 60.0);
    double carbonTrend =
        (last.carbonIntensity() - first.carbonIntensity()) / hoursBetween;

    List<String> alerts = new ArrayList<>();
    if (last.priceMwh() > averagePrice + (1.5 * priceStdDev)) {
      double spikePercent =
          ((last.priceMwh() - averagePrice) / averagePrice) * 100.0;
      alerts.add(String.format("Price spike detected: +%.1f%% vs average", spikePercent));
    }
    if (last.demandMw() > peakDemand * 0.98) {
      alerts.add("Demand is approaching the observed peak load");
    }
    if (last.renewablesShare() < averageRenewables - 8.0) {
      alerts.add("Renewable output is significantly below typical levels");
    }
    if (carbonTrend > 1.0) {
      alerts.add("Carbon intensity trending upward");
    }

    return new MarketInsights(
        first.timestamp(),
        last.timestamp(),
        round(averagePrice, 2),
        round(priceStdDev, 2),
        round(minPrice, 2),
        round(maxPrice, 2),
        round(averageDemand, 0),
        round(peakDemand, 0),
        round(averageRenewables, 1),
        round(carbonTrend, 2),
        alerts);
  }

  private MarketOverview buildOverview(
      MarketCode market, List<PricePoint> history, MarketInsights insights) {
    PricePoint first = history.getFirst();
    PricePoint last = history.getLast();
    double priceDelta = last.priceMwh() - first.priceMwh();
    double changePercent =
        first.priceMwh() == 0.0 ? 0.0 : (priceDelta / first.priceMwh()) * 100.0;

    return new MarketOverview(
        market.code(),
        market.name(),
        market.region(),
        market.timezone(),
        market.description(),
        round(last.priceMwh(), 2),
        round(changePercent, 2),
        insights.averagePrice(),
        round(last.demandMw(), 0),
        round(last.renewablesShare(), 1),
        round(last.carbonIntensity(), 1),
        round(market.parameters().basePrice(), 2),
        last.timestamp());
  }

  private List<ForecastPoint> buildForecast(
      MarketCode market,
      List<PricePoint> history,
      Duration horizon,
      Duration interval,
      double priceStdDev) {
    validateDurations(horizon, interval, "forecast");
    long horizonMinutes = horizon.toMinutes();
    long intervalMinutes = interval.toMinutes();
    int steps = Math.toIntExact(horizonMinutes / intervalMinutes);
    if (steps == 0) {
      return List.of();
    }

    PricePoint last = history.getLast();
    Instant start = last.timestamp();
    double slopePerHour = computePriceSlope(history);
    MarketParameters parameters = market.parameters();
    ZoneId zoneId = ZoneId.of(market.timezone());
    double baseVolatility = priceStdDev <= 0.0 ? parameters.volatility() : priceStdDev;

    List<ForecastPoint> forecast = new ArrayList<>(steps);
    for (int i = 1; i <= steps; i++) {
      Instant timestamp = start.plus(interval.multipliedBy(i));
      ZonedDateTime zoned = timestamp.atZone(zoneId);
      double minutesOfDay = zoned.getHour() * 60.0 + zoned.getMinute();
      double dayProgress = minutesOfDay / (24.0 * 60.0);
      double weekProgress =
          ((double) (zoned.getDayOfWeek().getValue() - 1) + dayProgress) / 7.0;
      double hoursAhead = (intervalMinutes * i) / 60.0;

      double baseline = last.priceMwh() + slopePerHour * hoursAhead;
      double seasonalDaily = parameters.dailySwing() * 0.35 * Math.sin(2 * Math.PI * dayProgress);
      double seasonalWeekly =
          parameters.weeklySwing() * 0.2 * Math.sin(2 * Math.PI * weekProgress);
      double projected = baseline + seasonalDaily + seasonalWeekly;

      double confidence = Math.max(parameters.volatility(), baseVolatility) * Math.sqrt(i);
      double lower = Math.max(MIN_PRICE, projected - confidence);
      double upper = projected + confidence;

      forecast.add(
          new ForecastPoint(
              timestamp,
              round(projected, 2),
              round(lower, 2),
              round(upper, 2)));
    }

    return List.copyOf(forecast);
  }

  private double computePriceSlope(List<PricePoint> history) {
    if (history.size() < 2) {
      return 0.0;
    }
    int lookback = Math.max(0, history.size() - 8);
    PricePoint start = history.get(lookback);
    PricePoint end = history.getLast();
    double hours =
        Math.max(1.0, Duration.between(start.timestamp(), end.timestamp()).toMinutes() / 60.0);
    return (end.priceMwh() - start.priceMwh()) / hours;
  }

  private double computePrice(
      MarketParameters parameters,
      double hoursFromStart,
      double dayProgress,
      double weekProgress,
      double noise) {
    double daily = parameters.dailySwing() * Math.sin(2 * Math.PI * dayProgress);
    double weekly = parameters.weeklySwing() * Math.sin(2 * Math.PI * weekProgress);
    double structural = parameters.trendSlope() * (hoursFromStart / 24.0);
    double stochastic = noise * parameters.volatility();
    double value = parameters.basePrice() + daily + weekly + structural + stochastic;
    return Math.max(MIN_PRICE, value);
  }

  private double computeDemand(
      MarketParameters parameters,
      double hoursFromStart,
      double dayProgress,
      double weekProgress,
      double price,
      double noise) {
    double diurnal =
        parameters.demandSwing()
            * (1.1 - Math.cos(2 * Math.PI * dayProgress - Math.PI / 6));
    double weekly = parameters.demandSwing() * 0.25 * Math.sin(2 * Math.PI * weekProgress);
    double priceCoupling = (price - parameters.basePrice()) * 35.0;
    double shortNoise = 180.0 * Math.sin(hoursFromStart / 4.5 + noise);
    double demand = parameters.demandBase() + diurnal + weekly + priceCoupling + shortNoise;
    return Math.max(parameters.demandBase() * MIN_DEMAND_FACTOR, demand);
  }

  private double computeRenewables(
      MarketParameters parameters,
      double hoursFromStart,
      double dayProgress,
      double weekProgress,
      double noise) {
    double solarShape =
        parameters.renewableSwing() * Math.max(0.0, Math.sin(Math.PI * dayProgress));
    double windShape = parameters.renewableSwing() * 0.35 * Math.sin(2 * Math.PI * weekProgress);
    double intraDayVariance = 2.5 * Math.sin(hoursFromStart / 3.5 + noise);
    double renewables =
        parameters.renewableBase() + solarShape + windShape + intraDayVariance;
    return clamp(renewables, MIN_RENEWABLE_SHARE, MAX_RENEWABLE_SHARE);
  }

  private double computeCarbon(MarketParameters parameters, double demand, double renewablesShare) {
    double renewableFactor = 1.0 - (renewablesShare / 100.0);
    double loadInfluence = 0.04 * (demand - parameters.demandBase());
    double carbon = parameters.carbonBase() + parameters.carbonSwing() * renewableFactor + loadInfluence;
    return Math.max(MIN_CARBON_INTENSITY, carbon);
  }

  private double computeNoise(Instant timestamp, int marketOrdinal) {
    long minutes = timestamp.getEpochSecond() / 60;
    double seed = minutes / 15.0 + marketOrdinal * 0.73;
    return Math.sin(seed) + 0.4 * Math.cos(seed * 1.7);
  }

  private void validateDurations(Duration range, Duration interval, String label) {
    if (range.isZero() || range.isNegative()) {
      throw new IllegalArgumentException(label + " range must be positive");
    }
    if (interval.isZero() || interval.isNegative()) {
      throw new IllegalArgumentException(label + " interval must be positive");
    }
    long rangeMinutes = range.toMinutes();
    long intervalMinutes = interval.toMinutes();
    if (rangeMinutes % intervalMinutes != 0) {
      throw new IllegalArgumentException(label + " range must be divisible by its interval");
    }
  }

  private double clamp(double value, double min, double max) {
    return Math.max(min, Math.min(max, value));
  }

  private double round(double value, int digits) {
    double factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
  }

  private record MarketContext(
      MarketOverview overview, List<PricePoint> history, MarketInsights insights) {}
}
