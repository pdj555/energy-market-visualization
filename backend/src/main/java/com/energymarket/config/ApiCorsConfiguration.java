package com.energymarket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

/**
 * Allows the separately hosted dashboard (localhost:3000, Vercel) to call this API.
 *
 * <p>The service is a public read-only feed. Credentials are not used, so any origin may GET {@code
 * /api/**}.
 */
@Configuration
public class ApiCorsConfiguration {

  @Bean
  public CorsWebFilter corsWebFilter() {
    CorsConfiguration cors = new CorsConfiguration();
    cors.addAllowedOriginPattern("*");
    cors.addAllowedMethod(HttpMethod.GET);
    cors.addAllowedMethod(HttpMethod.HEAD);
    cors.addAllowedMethod(HttpMethod.OPTIONS);
    cors.addAllowedHeader("*");
    cors.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", cors);
    return new CorsWebFilter(source);
  }
}
