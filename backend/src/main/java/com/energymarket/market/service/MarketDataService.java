package com.energymarket.market.service;

import com.energymarket.market.MarketCode;
import com.energymarket.market.exception.MarketNotFoundException;
import com.energymarket.market.generator.MarketDataGenerator;
import com.energymarket.market.model.MarketMetadata;
import com.energymarket.market.model.MarketOverview;
import com.energymarket.market.model.MarketSnapshot;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Application service orchestrating synthetic data generation for API consumers.
 */
@Service
public class MarketDataService {

  private static final Duration OVERVIEW_HISTORY_RANGE = Duration.ofHours(24);
  private static final Duration OVERVIEW_HISTORY_INTERVAL = Duration.ofMinutes(15);

  private final Clock clock;
  private final MarketDataGenerator generator;

  public MarketDataService(Clock clock) {
    this(clock, new MarketDataGenerator());
  }

  MarketDataService(Clock clock, MarketDataGenerator generator) {
    this.clock = Objects.requireNonNull(clock, "clock");
    this.generator = Objects.requireNonNull(generator, "generator");
  }

  /**
   * Returns metadata for the supported markets.
   */
  public List<MarketMetadata> getMarketCatalog() {
    return Arrays.stream(MarketCode.values())
        .map(MarketCode::toMetadata)
        .sorted((left, right) -> left.name().compareToIgnoreCase(right.name()))
        .collect(Collectors.toList());
  }

  /**
   * Returns high-level overviews for every market.
   */
  public List<MarketOverview> getMarketOverview() {
    Instant now = clock.instant();
    return Arrays.stream(MarketCode.values())
        .map(code -> generator.generateOverview(code, now, OVERVIEW_HISTORY_RANGE, OVERVIEW_HISTORY_INTERVAL))
        .sorted((left, right) -> left.name().compareToIgnoreCase(right.name()))
        .collect(Collectors.toList());
  }

  /**
   * Builds a detailed market snapshot used by the dashboard.
   *
   * @param marketCode requested market identifier
   * @param historyHours number of hours of history to include (1-168)
   * @param historyResolutionMinutes resolution of the history in minutes (5-180)
   * @param forecastHours forecast horizon in hours (1-72)
   * @param forecastResolutionMinutes forecast sampling in minutes (15-240)
   * @return generated market snapshot
   */
  public MarketSnapshot getMarketSnapshot(
      String marketCode,
      int historyHours,
      int historyResolutionMinutes,
      int forecastHours,
      int forecastResolutionMinutes) {
    MarketCode market =
        MarketCode.fromCode(marketCode)
            .orElseThrow(() -> new MarketNotFoundException(marketCode));

    Duration historyRange = toDurationHours(historyHours, 1, 168, "historyHours");
    Duration historyInterval = toDurationMinutes(historyResolutionMinutes, 5, 180, "historyResolutionMinutes");
    ensureDivisible(historyRange, historyInterval, "history range", "history interval");

    Duration forecastRange = toDurationHours(forecastHours, 1, 72, "forecastHours");
    Duration forecastInterval = toDurationMinutes(forecastResolutionMinutes, 15, 240, "forecastResolutionMinutes");
    ensureDivisible(forecastRange, forecastInterval, "forecast range", "forecast interval");

    Instant now = clock.instant();
    return generator.generateSnapshot(market, now, historyRange, historyInterval, forecastRange, forecastInterval);
  }

  private Duration toDurationHours(int value, int minInclusive, int maxInclusive, String field) {
    if (value < minInclusive || value > maxInclusive) {
      throw new IllegalArgumentException(
          String.format(
              Locale.US,
              "%s must be between %d and %d hours",
              field,
              minInclusive,
              maxInclusive));
    }
    return Duration.ofHours(value);
  }

  private Duration toDurationMinutes(int value, int minInclusive, int maxInclusive, String field) {
    if (value < minInclusive || value > maxInclusive) {
      throw new IllegalArgumentException(
          String.format(
              Locale.US,
              "%s must be between %d and %d minutes",
              field,
              minInclusive,
              maxInclusive));
    }
    return Duration.ofMinutes(value);
  }

  private void ensureDivisible(Duration range, Duration interval, String rangeName, String intervalName) {
    if (range.toMinutes() % interval.toMinutes() != 0) {
      throw new IllegalArgumentException(rangeName + " must be evenly divisible by " + intervalName);
    }
  }
}
