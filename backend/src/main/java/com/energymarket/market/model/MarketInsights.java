package com.energymarket.market.model;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * Statistical insights summarising market behaviour over a time window.
 */
public record MarketInsights(
    Instant windowStart,
    Instant windowEnd,
    double averagePrice,
    double priceStandardDeviation,
    double minPrice,
    double maxPrice,
    double averageDemand,
    double peakDemand,
    double averageRenewablesShare,
    double carbonIntensityTrendPerHour,
    List<String> alerts) {

  public MarketInsights {
    Objects.requireNonNull(windowStart, "windowStart");
    Objects.requireNonNull(windowEnd, "windowEnd");
    alerts = List.copyOf(alerts);
  }
}
