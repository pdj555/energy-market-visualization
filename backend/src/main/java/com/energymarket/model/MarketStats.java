package com.energymarket.model;

import java.time.Instant;
import java.util.Map;

/** Model representing overall market statistics. */
public class MarketStats {
  private final double totalVolume;
  private final double averagePrice;
  private final Map<EnergyType, Double> volumeByType;
  private final Map<EnergyType, Double> priceByType;
  private final Instant timestamp;

  public MarketStats(
      final double totalVolume,
      final double averagePrice,
      final Map<EnergyType, Double> volumeByType,
      final Map<EnergyType, Double> priceByType,
      final Instant timestamp) {
    this.totalVolume = totalVolume;
    this.averagePrice = averagePrice;
    this.volumeByType = volumeByType;
    this.priceByType = priceByType;
    this.timestamp = timestamp;
  }

  public double getTotalVolume() {
    return totalVolume;
  }

  public double getAveragePrice() {
    return averagePrice;
  }

  public Map<EnergyType, Double> getVolumeByType() {
    return volumeByType;
  }

  public Map<EnergyType, Double> getPriceByType() {
    return priceByType;
  }

  public Instant getTimestamp() {
    return timestamp;
  }
}
