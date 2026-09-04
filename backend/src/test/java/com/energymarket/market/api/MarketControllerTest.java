package com.energymarket.market.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.energymarket.config.ApiCorsConfiguration;
import com.energymarket.market.model.MarketMetadata;
import com.energymarket.market.service.MarketDataService;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

@WebFluxTest(controllers = MarketController.class)
@Import({
  MarketDataService.class,
  ApiExceptionHandler.class,
  ApiCorsConfiguration.class,
  MarketControllerTest.TestClockConfig.class
})
@TestPropertySource(properties = "spring.main.web-application-type=reactive")
class MarketControllerTest {

  @Autowired private WebTestClient webTestClient;

  @Test
  void shouldReturnMarketCatalog() {
    webTestClient
        .get()
        .uri("/api/markets/catalog")
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
                    .path("/api/markets/NEISO/snapshot")
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
        .uri(
            uriBuilder ->
                uriBuilder
                    .path("/api/markets/UNKNOWN/snapshot")
                    .queryParam("historyHours", 24)
                    .queryParam("historyResolutionMinutes", 15)
                    .queryParam("forecastHours", 12)
                    .queryParam("forecastResolutionMinutes", 60)
                    .build())
        .exchange()
        .expectStatus()
        .isNotFound()
        .expectBody()
        .jsonPath("$.title")
        .isEqualTo("Market not found");
  }

  @Test
  void catalogAllowsDashboardOrigin() {
    webTestClient
        .get()
        .uri("http://localhost/api/markets/catalog")
        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .valueEquals(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000");
  }

  @Test
  void catalogPreflightAllowsDashboardOrigin() {
    webTestClient
        .options()
        .uri("http://localhost/api/markets/catalog")
        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .valueEquals(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000");
  }

  static class TestClockConfig {
    @Bean
    Clock testClock() {
      return Clock.fixed(Instant.parse("2025-01-15T12:00:00Z"), ZoneOffset.UTC);
    }
  }
}
