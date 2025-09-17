package com.energymarket.market.model;

import java.time.Instant;
import java.util.Objects;

/**
 * Represents a single historical measurement of the market.
 */
public record PricePoint(
    Instant timestamp,
    double priceMwh,
    double demandMw,
    double carbonIntensity,
    double renewablesShare) {

  public PricePoint {
    Objects.requireNonNull(timestamp, "timestamp");
  }
}
