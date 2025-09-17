package com.energymarket.market.model;

import java.time.Instant;
import java.util.Objects;

/**
 * Forecasted price envelope for a future interval.
 */
public record ForecastPoint(Instant timestamp, double projectedPriceMwh, double lowerBound, double upperBound) {

  public ForecastPoint {
    Objects.requireNonNull(timestamp, "timestamp");
  }
}
