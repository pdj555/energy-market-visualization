package com.energymarket.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.energymarket.model.EnergyPrice;
import com.energymarket.model.EnergyType;
import com.energymarket.model.MarketStats;
import com.energymarket.service.EnergyMarketSimulationService;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(EnergyMarketController.class)
class EnergyMarketControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private EnergyMarketSimulationService simulationService;

  private EnergyPrice mockEnergyPrice;
  private MarketStats mockMarketStats;

  @BeforeEach
  void setUp() {
    mockEnergyPrice = new EnergyPrice(EnergyType.ELECTRICITY, 45.50, "MWh", Instant.now(), 2.5);

    Map<EnergyType, Double> volumeByType = new HashMap<>();
    Map<EnergyType, Double> priceByType = new HashMap<>();
    for (EnergyType type : EnergyType.values()) {
      volumeByType.put(type, 2000.0);
      priceByType.put(type, 30.0);
    }

    mockMarketStats = new MarketStats(14000.0, 30.0, volumeByType, priceByType, Instant.now());
  }

  @Test
  void testGetCurrentPrices_Success() throws Exception {
    // Given
    when(simulationService.generateEnergyPrice(any(EnergyType.class))).thenReturn(mockEnergyPrice);

    // When & Then
    mockMvc
        .perform(get("/api/energy-market/prices").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[0].energyType").value("ELECTRICITY"))
        .andExpect(jsonPath("$[0].price").value(45.50))
        .andExpect(jsonPath("$[0].unit").value("MWh"))
        .andExpect(jsonPath("$[0].changePercent").value(2.5));
  }

  @Test
  void testGetPriceByType_ValidType() throws Exception {
    // Given
    when(simulationService.generateEnergyPrice(EnergyType.ELECTRICITY)).thenReturn(mockEnergyPrice);

    // When & Then
    mockMvc
        .perform(get("/api/energy-market/prices/ELECTRICITY").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.energyType").value("ELECTRICITY"))
        .andExpect(jsonPath("$.price").value(45.50))
        .andExpect(jsonPath("$.unit").value("MWh"))
        .andExpect(jsonPath("$.changePercent").value(2.5));
  }

  @Test
  void testGetPriceByType_InvalidType() throws Exception {
    // When & Then
    mockMvc
        .perform(get("/api/energy-market/prices/INVALID_TYPE").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testGetPriceByType_CaseInsensitive() throws Exception {
    // Given
    when(simulationService.generateEnergyPrice(EnergyType.SOLAR))
        .thenReturn(new EnergyPrice(EnergyType.SOLAR, 20.0, "MWh", Instant.now(), 1.0));

    // When & Then
    mockMvc
        .perform(get("/api/energy-market/prices/solar").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.energyType").value("SOLAR"));
  }

  @Test
  void testGetMarketStats_Success() throws Exception {
    // Given
    when(simulationService.generateMarketStats()).thenReturn(mockMarketStats);

    // When & Then
    mockMvc
        .perform(get("/api/energy-market/stats").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.totalVolume").value(14000.0))
        .andExpect(jsonPath("$.averagePrice").value(30.0))
        .andExpect(jsonPath("$.volumeByType").isMap())
        .andExpect(jsonPath("$.priceByType").isMap());
  }

  @Test
  void testGetEnergyTypes_Success() throws Exception {
    // When & Then
    mockMvc
        .perform(get("/api/energy-market/energy-types").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[0].type").exists())
        .andExpect(jsonPath("$[0].displayName").exists())
        .andExpect(jsonPath("$[0].unit").exists());
  }

  @Test
  void testCorsHeaders() throws Exception {
    // When & Then
    mockMvc
        .perform(get("/api/energy-market/energy-types").header("Origin", "http://localhost:5173"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
  }
}
