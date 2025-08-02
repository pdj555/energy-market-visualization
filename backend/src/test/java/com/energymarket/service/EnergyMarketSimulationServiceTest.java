package com.energymarket.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.energymarket.model.EnergyPrice;
import com.energymarket.model.EnergyType;
import com.energymarket.model.MarketStats;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class EnergyMarketSimulationServiceTest {

  @InjectMocks private EnergyMarketSimulationService simulationService;

  @BeforeEach
  void setUp() {
    // Set field values using reflection
    ReflectionTestUtils.setField(simulationService, "priceVolatility", 0.05);
    ReflectionTestUtils.setField(simulationService, "electricityBasePrice", 50.0);
    ReflectionTestUtils.setField(simulationService, "gasBasePrice", 30.0);
    ReflectionTestUtils.setField(simulationService, "coalBasePrice", 40.0);
    ReflectionTestUtils.setField(simulationService, "solarBasePrice", 20.0);
    ReflectionTestUtils.setField(simulationService, "windBasePrice", 25.0);
    ReflectionTestUtils.setField(simulationService, "nuclearBasePrice", 35.0);
    ReflectionTestUtils.setField(simulationService, "hydroBasePrice", 22.0);

    // Initialize prices using reflection since the method is private
    ReflectionTestUtils.invokeMethod(simulationService, "initializePrices");
  }

  @Test
  void testGenerateEnergyPrice_ReturnsValidPrice() {
    // When
    EnergyPrice price = simulationService.generateEnergyPrice(EnergyType.ELECTRICITY);

    // Then
    assertNotNull(price);
    assertEquals(EnergyType.ELECTRICITY, price.getEnergyType());
    assertEquals("MWh", price.getUnit());
    assertNotNull(price.getTimestamp());
    assertTrue(price.getPrice() > 0);
    assertTrue(Math.abs(price.getChangePercent()) <= 5.0); // Within volatility range
  }

  @Test
  void testGenerateEnergyPrice_DifferentEnergyTypes() {
    // Test all energy types
    for (EnergyType type : EnergyType.values()) {
      // When
      EnergyPrice price = simulationService.generateEnergyPrice(type);

      // Then
      assertNotNull(price);
      assertEquals(type, price.getEnergyType());
      assertEquals(type.getUnit(), price.getUnit());
      assertTrue(price.getPrice() > 0);
    }
  }

  @Test
  void testGenerateMarketStats_ReturnsValidStats() {
    // When
    MarketStats stats = simulationService.generateMarketStats();

    // Then
    assertNotNull(stats);
    assertTrue(stats.getTotalVolume() > 0);
    assertTrue(stats.getAveragePrice() > 0);
    assertNotNull(stats.getVolumeByType());
    assertNotNull(stats.getPriceByType());
    assertNotNull(stats.getTimestamp());

    // Verify all energy types are present
    assertEquals(EnergyType.values().length, stats.getVolumeByType().size());
    assertEquals(EnergyType.values().length, stats.getPriceByType().size());
  }

  @Test
  void testGetCurrentPrice_ReturnsCorrectPrice() {
    // Given
    simulationService.generateEnergyPrice(EnergyType.SOLAR);

    // When
    double currentPrice = simulationService.getCurrentPrice(EnergyType.SOLAR);

    // Then
    assertTrue(currentPrice > 0);
  }

  @Test
  void testGetAllCurrentPrices_ReturnsAllPrices() {
    // When
    Map<EnergyType, Double> allPrices = simulationService.getAllCurrentPrices();

    // Then
    assertNotNull(allPrices);
    assertEquals(EnergyType.values().length, allPrices.size());

    for (EnergyType type : EnergyType.values()) {
      assertTrue(allPrices.containsKey(type));
      assertTrue(allPrices.get(type) > 0);
    }
  }

  @Test
  void testPriceFluctuation_StaysWithinVolatilityBounds() {
    // Given
    double volatility = 0.05;
    int iterations = 100;

    for (EnergyType type : EnergyType.values()) {
      double initialPrice = simulationService.getCurrentPrice(type);

      // When - Generate multiple prices
      for (int i = 0; i < iterations; i++) {
        EnergyPrice price = simulationService.generateEnergyPrice(type);

        // Then - Verify change percent is within bounds
        assertTrue(
            Math.abs(price.getChangePercent()) <= volatility * 100,
            "Change percent " + price.getChangePercent() + " exceeds volatility bounds");
      }
    }
  }

  @Test
  void testMarketStats_VolumeWithinExpectedRange() {
    // When
    MarketStats stats = simulationService.generateMarketStats();

    // Then
    for (Map.Entry<EnergyType, Double> entry : stats.getVolumeByType().entrySet()) {
      double volume = entry.getValue();
      assertTrue(
          volume >= 1000 && volume <= 5000,
          "Volume " + volume + " for " + entry.getKey() + " is outside expected range");
    }
  }

  @Test
  void testMarketStats_AveragePriceCalculation() {
    // When
    MarketStats stats = simulationService.generateMarketStats();

    // Then - Verify average price is reasonable
    double totalWeightedPrice = 0;
    double totalVolume = 0;

    for (EnergyType type : EnergyType.values()) {
      double price = stats.getPriceByType().get(type);
      double volume = stats.getVolumeByType().get(type);
      totalWeightedPrice += price * volume;
      totalVolume += volume;
    }

    double expectedAverage = totalWeightedPrice / totalVolume;
    assertEquals(expectedAverage, stats.getAveragePrice(), 0.01);
  }
}
