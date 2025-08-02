package com.energymarket.service;

import com.energymarket.model.EnergyPrice;
import com.energymarket.model.EnergyType;
import com.energymarket.model.MarketStats;
import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Service that simulates energy market data with realistic price fluctuations. */
@Service
public class EnergyMarketSimulationService {

  private final Random random = new Random();
  private final Map<EnergyType, Double> currentPrices = new ConcurrentHashMap<>();
  private final Map<EnergyType, Double> previousPrices = new ConcurrentHashMap<>();

  @Value("${energy-market.simulation.price-volatility:0.05}")
  private double priceVolatility;

  @Value("${energy-market.simulation.base-prices.electricity:50.0}")
  private double electricityBasePrice;

  @Value("${energy-market.simulation.base-prices.gas:30.0}")
  private double gasBasePrice;

  @Value("${energy-market.simulation.base-prices.coal:40.0}")
  private double coalBasePrice;

  @Value("${energy-market.simulation.base-prices.solar:20.0}")
  private double solarBasePrice;

  @Value("${energy-market.simulation.base-prices.wind:25.0}")
  private double windBasePrice;

  @Value("${energy-market.simulation.base-prices.nuclear:35.0}")
  private double nuclearBasePrice;

  @Value("${energy-market.simulation.base-prices.hydro:22.0}")
  private double hydroBasePrice;

  @PostConstruct
  private void initializePrices() {
    currentPrices.put(EnergyType.ELECTRICITY, electricityBasePrice);
    currentPrices.put(EnergyType.GAS, gasBasePrice);
    currentPrices.put(EnergyType.COAL, coalBasePrice);
    currentPrices.put(EnergyType.SOLAR, solarBasePrice);
    currentPrices.put(EnergyType.WIND, windBasePrice);
    currentPrices.put(EnergyType.NUCLEAR, nuclearBasePrice);
    currentPrices.put(EnergyType.HYDRO, hydroBasePrice);

    previousPrices.putAll(currentPrices);
  }

  /** Generates a new energy price with simulated fluctuation. */
  public EnergyPrice generateEnergyPrice(final EnergyType energyType) {
    final double previousPrice = previousPrices.get(energyType);
    final double changePercent = (random.nextDouble() - 0.5) * 2 * priceVolatility;
    final double newPrice = previousPrice * (1 + changePercent);

    currentPrices.put(energyType, newPrice);
    previousPrices.put(energyType, newPrice);

    return new EnergyPrice(
        energyType,
        Math.round(newPrice * 100.0) / 100.0,
        energyType.getUnit(),
        Instant.now(),
        Math.round(changePercent * 10000.0) / 100.0);
  }

  /** Generates market statistics based on current prices and simulated volumes. */
  public MarketStats generateMarketStats() {
    final Map<EnergyType, Double> volumeByType = new HashMap<>();
    final Map<EnergyType, Double> priceByType = new HashMap<>();
    double totalVolume = 0;
    double weightedPriceSum = 0;

    for (final EnergyType type : EnergyType.values()) {
      final double volume = 1000 + random.nextDouble() * 4000; // Random volume between 1000-5000
      final double price = currentPrices.get(type);

      volumeByType.put(type, Math.round(volume * 100.0) / 100.0);
      priceByType.put(type, Math.round(price * 100.0) / 100.0);

      totalVolume += volume;
      weightedPriceSum += price * volume;
    }

    final double averagePrice = weightedPriceSum / totalVolume;

    return new MarketStats(
        Math.round(totalVolume * 100.0) / 100.0,
        Math.round(averagePrice * 100.0) / 100.0,
        volumeByType,
        priceByType,
        Instant.now());
  }

  /** Gets the current price for a specific energy type. */
  public double getCurrentPrice(final EnergyType energyType) {
    return currentPrices.get(energyType);
  }

  /** Gets all current prices. */
  public Map<EnergyType, Double> getAllCurrentPrices() {
    return new HashMap<>(currentPrices);
  }
}
