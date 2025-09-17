package com.energymarket.market.model;

import java.util.List;
import java.util.Objects;

/**
 * Composite response bundling the key datasets required by the dashboard.
 */
public record MarketSnapshot(
    MarketOverview overview,
    List<PricePoint> priceSeries,
    List<ForecastPoint> forecast,
    MarketInsights insights) {

  public MarketSnapshot {
    Objects.requireNonNull(overview, "overview");
    Objects.requireNonNull(insights, "insights");
    priceSeries = List.copyOf(priceSeries);
    forecast = List.copyOf(forecast);
  }
}
