package com.energymarket.market.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.energymarket.market.exception.MarketNotFoundException;
import com.energymarket.market.generator.MarketDataGenerator;
import com.energymarket.market.model.MarketMetadata;
import com.energymarket.market.model.MarketSnapshot;
import com.energymarket.market.model.PricePoint;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MarketDataServiceTest {

  private MarketDataService service;

  @BeforeEach
  void setUp() {
    Clock fixedClock = Clock.fixed(Instant.parse("2025-01-15T12:00:00Z"), ZoneOffset.UTC);
    service = new MarketDataService(fixedClock, new MarketDataGenerator());
  }

  @Test
  void shouldGenerateConsistentSnapshot() {
    MarketSnapshot snapshot = service.getMarketSnapshot("NEISO", 24, 15, 12, 60);

    assertThat(snapshot.overview().code()).isEqualTo("NEISO");
    assertThat(snapshot.priceSeries())
        .hasSize(97)
        .isSortedAccordingTo(Comparator.comparing(PricePoint::timestamp))
        .allSatisfy(
            point -> {
              assertThat(point.priceMwh()).isGreaterThan(0.0);
              assertThat(point.demandMw()).isGreaterThan(0.0);
              assertThat(point.renewablesShare()).isBetween(0.0, 100.0);
            });
    assertThat(snapshot.forecast()).hasSize(12);
    assertThat(snapshot.insights().alerts()).isNotNull();
  }

  @Test
  void shouldRejectInvalidHistoryResolution() {
    assertThatThrownBy(() -> service.getMarketSnapshot("NEISO", 24, 4, 12, 60))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("historyResolutionMinutes");
  }

  @Test
  void shouldRejectInvalidForecastResolution() {
    assertThatThrownBy(() -> service.getMarketSnapshot("NEISO", 24, 15, 12, 10))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("forecastResolutionMinutes");
  }

  @Test
  void shouldRejectUnknownMarketCode() {
    assertThatThrownBy(() -> service.getMarketSnapshot("UNKNOWN", 24, 15, 12, 60))
        .isInstanceOf(MarketNotFoundException.class)
        .hasMessageContaining("Unknown market code");
  }

  @Test
  void shouldListCatalogSortedByName() {
    List<MarketMetadata> catalog = service.getMarketCatalog();

    assertThat(catalog).isNotEmpty();
    assertThat(catalog)
        .isSortedAccordingTo(Comparator.comparing(MarketMetadata::name, String.CASE_INSENSITIVE_ORDER));
    assertThat(catalog).extracting(MarketMetadata::code).contains("NEISO", "ERCOT");
  }
}
