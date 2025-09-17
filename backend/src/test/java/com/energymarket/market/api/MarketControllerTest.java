package com.energymarket.market.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.energymarket.market.generator.MarketDataGenerator;
import com.energymarket.market.model.MarketMetadata;
import com.energymarket.market.service.MarketDataService;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

class MarketControllerTest {

  private WebTestClient webTestClient;

  @BeforeEach
  void setUp() {
    Clock clock = Clock.fixed(Instant.parse("2025-01-15T12:00:00Z"), ZoneOffset.UTC);
    MarketDataService service = new MarketDataService(clock, new MarketDataGenerator());
    MarketController controller = new MarketController(service);
    this.webTestClient =
        WebTestClient.bindToController(controller)
            .controllerAdvice(new ApiExceptionHandler())
            .configureClient()
            .baseUrl("/api/markets")
            .build();
  }

  @Test
  void shouldReturnMarketCatalog() {
    webTestClient
        .get()
        .uri("/catalog")
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .contentType(MediaType.APPLICATION_JSON)
        .expectBodyList(MarketMetadata.class)
        .value(
            list -> {
              assertThat(list).isNotEmpty();
              assertThat(list).extracting(MarketMetadata::code).contains("NEISO");
            });
  }

  @Test
  void shouldReturnSnapshot() {
    webTestClient
        .get()
        .uri(
            uriBuilder ->
                uriBuilder
                    .path("/NEISO/snapshot")
                    .queryParam("historyHours", 24)
                    .queryParam("historyResolutionMinutes", 15)
                    .queryParam("forecastHours", 12)
                    .queryParam("forecastResolutionMinutes", 60)
                    .build())
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .contentType(MediaType.APPLICATION_JSON)
        .expectBody()
        .jsonPath("$.overview.code")
        .isEqualTo("NEISO")
        .jsonPath("$.priceSeries.length()")
        .isEqualTo(97)
        .jsonPath("$.forecast.length()")
        .isEqualTo(12)
        .jsonPath("$.insights.alerts")
        .isArray();
  }

  @Test
  void shouldReturnNotFoundForUnknownMarket() {
    webTestClient
        .get()
        .uri("/UNKNOWN/snapshot")
        .exchange()
        .expectStatus()
        .isNotFound()
        .expectBody()
        .jsonPath("$.title")
        .isEqualTo("Market not found");
  }
}
