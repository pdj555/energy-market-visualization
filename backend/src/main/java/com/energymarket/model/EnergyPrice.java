package com.energymarket.model;

import java.time.Instant;

/**
 * Model representing energy price data at a specific point in time.
 */
public class EnergyPrice {
  private final EnergyType energyType;
  private final double price;
  private final String unit;
  private final Instant timestamp;
  private final double changePercent;

  public EnergyPrice(
      final EnergyType energyType,
      final double price,
      final String unit,
      final Instant timestamp,
      final double changePercent) {
    this.energyType = energyType;
    this.price = price;
    this.unit = unit;
    this.timestamp = timestamp;
    this.changePercent = changePercent;
  }

  public EnergyType getEnergyType() {
    return energyType;
  }

  public double getPrice() {
    return price;
  }

  public String getUnit() {
    return unit;
  }

  public Instant getTimestamp() {
    return timestamp;
  }

  public double getChangePercent() {
    return changePercent;
  }
}