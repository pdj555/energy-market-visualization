package com.energymarket.controller;

import com.energymarket.model.EnergyPrice;
import com.energymarket.model.EnergyType;
import com.energymarket.model.MarketStats;
import com.energymarket.service.EnergyMarketSimulationService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for energy market data endpoints.
 */
@RestController
@RequestMapping("/api/energy-market")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class EnergyMarketController {

  private final EnergyMarketSimulationService simulationService;

  public EnergyMarketController(final EnergyMarketSimulationService simulationService) {
    this.simulationService = simulationService;
  }

  /**
   * Get current prices for all energy types.
   */
  @GetMapping("/prices")
  public ResponseEntity<List<EnergyPrice>> getCurrentPrices() {
    final List<EnergyPrice> prices = new ArrayList<>();
    for (final EnergyType type : EnergyType.values()) {
      prices.add(simulationService.generateEnergyPrice(type));
    }
    return ResponseEntity.ok(prices);
  }

  /**
   * Get current price for a specific energy type.
   */
  @GetMapping("/prices/{energyType}")
  public ResponseEntity<EnergyPrice> getPriceByType(@PathVariable final String energyType) {
    try {
      final EnergyType type = EnergyType.valueOf(energyType.toUpperCase());
      final EnergyPrice price = simulationService.generateEnergyPrice(type);
      return ResponseEntity.ok(price);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * Get current market statistics.
   */
  @GetMapping("/stats")
  public ResponseEntity<MarketStats> getMarketStats() {
    return ResponseEntity.ok(simulationService.generateMarketStats());
  }

  /**
   * Get all available energy types.
   */
  @GetMapping("/energy-types")
  public ResponseEntity<List<Map<String, String>>> getEnergyTypes() {
    final List<Map<String, String>> types = new ArrayList<>();
    for (final EnergyType type : EnergyType.values()) {
      types.add(Map.of(
          "type", type.name(),
          "displayName", type.getDisplayName(),
          "unit", type.getUnit()
      ));
    }
    return ResponseEntity.ok(types);
  }
}