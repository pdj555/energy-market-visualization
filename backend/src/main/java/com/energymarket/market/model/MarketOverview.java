package com.energymarket.market.model;

import java.time.Instant;
import java.util.Objects;

/**
 * High-level snapshot of market health used by dashboards and list views.
 */
public record MarketOverview(
    String code,
    String name,
    String region,
    String timezone,
    String description,
    double currentPrice,
    double priceChangePercent,
    double averagePrice,
    double demandMw,
    double renewablesShare,
    double carbonIntensity,
    double typicalPrice,
    Instant lastUpdated) {

  public MarketOverview {
    Objects.requireNonNull(code, "code");
    Objects.requireNonNull(name, "name");
    Objects.requireNonNull(region, "region");
    Objects.requireNonNull(timezone, "timezone");
    Objects.requireNonNull(description, "description");
    Objects.requireNonNull(lastUpdated, "lastUpdated");
  }
}
