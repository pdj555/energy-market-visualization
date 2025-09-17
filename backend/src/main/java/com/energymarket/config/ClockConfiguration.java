package com.energymarket.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Provides application wide time configuration.
 *
 * <p>Having the clock as a managed bean enables deterministic testing and a single source of
 * truth for all time based calculations across the service.
 */
@Configuration
public class ClockConfiguration {

  /**
   * Exposes the system UTC clock so time calculations are consistent and easily overridden in
   * tests.
   *
   * @return the system UTC clock
   */
  @Bean
  public Clock systemClock() {
    return Clock.systemUTC();
  }
}
