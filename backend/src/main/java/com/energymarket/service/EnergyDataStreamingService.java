package com.energymarket.service;

import com.energymarket.model.EnergyPrice;
import com.energymarket.model.EnergyType;
import com.energymarket.model.MarketStats;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/** Service responsible for streaming real-time energy market data via WebSocket. */
@Service
public class EnergyDataStreamingService {

  private static final Logger logger = LoggerFactory.getLogger(EnergyDataStreamingService.class);

  private final SimpMessagingTemplate messagingTemplate;
  private final EnergyMarketSimulationService simulationService;
  private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(2);

  @Value("${energy-market.simulation.update-interval-ms:1000}")
  private long updateIntervalMs;

  public EnergyDataStreamingService(
      final SimpMessagingTemplate messagingTemplate,
      final EnergyMarketSimulationService simulationService) {
    this.messagingTemplate = messagingTemplate;
    this.simulationService = simulationService;
  }

  @PostConstruct
  public void startStreaming() {
    logger.info("Starting energy market data streaming with interval: {} ms", updateIntervalMs);

    // Stream energy prices
    executorService.scheduleAtFixedRate(
        this::streamEnergyPrices, 0, updateIntervalMs, TimeUnit.MILLISECONDS);

    // Stream market statistics
    executorService.scheduleAtFixedRate(
        this::streamMarketStats,
        500, // Offset by 500ms to spread the load
        updateIntervalMs,
        TimeUnit.MILLISECONDS);
  }

  @PreDestroy
  public void stopStreaming() {
    logger.info("Stopping energy market data streaming");
    executorService.shutdown();
    try {
      if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
        executorService.shutdownNow();
      }
    } catch (InterruptedException e) {
      executorService.shutdownNow();
      Thread.currentThread().interrupt();
    }
  }

  private void streamEnergyPrices() {
    try {
      final List<EnergyPrice> prices = new ArrayList<>();
      for (final EnergyType type : EnergyType.values()) {
        prices.add(simulationService.generateEnergyPrice(type));
      }
      messagingTemplate.convertAndSend("/topic/energy-prices", prices);
      logger.debug("Streamed {} energy prices", prices.size());
    } catch (Exception e) {
      logger.error("Error streaming energy prices", e);
    }
  }

  private void streamMarketStats() {
    try {
      final MarketStats stats = simulationService.generateMarketStats();
      messagingTemplate.convertAndSend("/topic/market-stats", stats);
      logger.debug("Streamed market statistics");
    } catch (Exception e) {
      logger.error("Error streaming market statistics", e);
    }
  }
}
