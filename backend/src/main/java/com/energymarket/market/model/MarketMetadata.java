package com.energymarket.market.model;

import java.util.Objects;

/**
 * Immutable metadata describing a wholesale electricity market.
 */
public record MarketMetadata(
    String code,
    String name,
    String region,
    String timezone,
    String description,
    double typicalPrice) {

  public MarketMetadata {
    Objects.requireNonNull(code, "code");
    Objects.requireNonNull(name, "name");
    Objects.requireNonNull(region, "region");
    Objects.requireNonNull(timezone, "timezone");
    Objects.requireNonNull(description, "description");
  }
}
