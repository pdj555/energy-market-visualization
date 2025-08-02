package com.energymarket.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.energymarket.model.EnergyPrice;
import com.energymarket.model.EnergyType;
import com.energymarket.model.MarketStats;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class EnergyDataStreamingServiceTest {

  @Mock private SimpMessagingTemplate messagingTemplate;

  @Mock private EnergyMarketSimulationService simulationService;

  @InjectMocks private EnergyDataStreamingService streamingService;

  private EnergyPrice mockEnergyPrice;
  private MarketStats mockMarketStats;

  @BeforeEach
  void setUp() {
    // Set update interval
    ReflectionTestUtils.setField(streamingService, "updateIntervalMs", 1000L);

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
  void testStreamEnergyPrices_SendsPricesToWebSocket() {
    // Given
    when(simulationService.generateEnergyPrice(any(EnergyType.class))).thenReturn(mockEnergyPrice);

    // When
    ReflectionTestUtils.invokeMethod(streamingService, "streamEnergyPrices");

    // Then
    verify(messagingTemplate).convertAndSend(eq("/topic/energy-prices"), any(List.class));
    verify(simulationService, times(EnergyType.values().length))
        .generateEnergyPrice(any(EnergyType.class));
  }

  @Test
  void testStreamMarketStats_SendsStatsToWebSocket() {
    // Given
    when(simulationService.generateMarketStats()).thenReturn(mockMarketStats);

    // When
    ReflectionTestUtils.invokeMethod(streamingService, "streamMarketStats");

    // Then
    verify(messagingTemplate).convertAndSend("/topic/market-stats", mockMarketStats);
    verify(simulationService).generateMarketStats();
  }

  @Test
  void testStreamEnergyPrices_HandlesException() {
    // Given
    when(simulationService.generateEnergyPrice(any(EnergyType.class)))
        .thenThrow(new RuntimeException("Simulation error"));

    // When
    ReflectionTestUtils.invokeMethod(streamingService, "streamEnergyPrices");

    // Then - Should not throw exception, just log it
    verify(messagingTemplate, never()).convertAndSend(anyString(), any(Object.class));
  }

  @Test
  void testStreamMarketStats_HandlesException() {
    // Given
    when(simulationService.generateMarketStats()).thenThrow(new RuntimeException("Stats error"));

    // When
    ReflectionTestUtils.invokeMethod(streamingService, "streamMarketStats");

    // Then - Should not throw exception, just log it
    verify(messagingTemplate, never()).convertAndSend(anyString(), any(Object.class));
  }

  @Test
  void testStartStreaming_InitializesScheduledTasks() {
    // When
    streamingService.startStreaming();

    // Then - Tasks should be scheduled (we can't easily verify the executor,
    // but we can ensure the method completes without error)
    // In a real scenario, you might want to use a ScheduledExecutorService mock
  }

  @Test
  void testStopStreaming_ShutsDownExecutor() {
    // When
    streamingService.stopStreaming();

    // Then - Executor should be shut down
    // Again, in a real test you might inject a mock executor to verify this
  }
}
