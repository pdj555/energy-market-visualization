package com.energymarket.market.api;

import com.energymarket.market.model.MarketMetadata;
import com.energymarket.market.model.MarketOverview;
import com.energymarket.market.model.MarketSnapshot;
import com.energymarket.market.service.MarketDataService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

/**
 * Reactive REST controller exposing the synthetic energy market intelligence API.
 */
@RestController
@RequestMapping("/api/markets")
@Validated
public class MarketController {

  private final MarketDataService marketDataService;

  public MarketController(MarketDataService marketDataService) {
    this.marketDataService = marketDataService;
  }

  /** Returns metadata for the available markets. */
  @GetMapping("/catalog")
  public Mono<List<MarketMetadata>> getMarketCatalog() {
    return Mono.fromSupplier(marketDataService::getMarketCatalog);
  }

  /** Returns an overview for all markets to support comparison dashboards. */
  @GetMapping("/overview")
  public Mono<List<MarketOverview>> getMarketOverview() {
    return Mono.fromSupplier(marketDataService::getMarketOverview);
  }

  /**
   * Returns the detailed snapshot for a specific market.
   */
  @GetMapping("/{marketCode}/snapshot")
  public Mono<MarketSnapshot> getMarketSnapshot(
      @PathVariable String marketCode,
      @RequestParam(defaultValue = "24") @Min(1) @Max(168) int historyHours,
      @RequestParam(defaultValue = "15") @Min(5) @Max(180) int historyResolutionMinutes,
      @RequestParam(defaultValue = "12") @Min(1) @Max(72) int forecastHours,
      @RequestParam(defaultValue = "60") @Min(15) @Max(240) int forecastResolutionMinutes) {
    return Mono.fromSupplier(
        () ->
            marketDataService.getMarketSnapshot(
                marketCode,
                historyHours,
                historyResolutionMinutes,
                forecastHours,
                forecastResolutionMinutes));
  }
}
