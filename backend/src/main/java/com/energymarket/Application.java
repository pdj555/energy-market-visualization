package com.energymarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Energy Market Visualization Service.
 *
 * <p>This is the entry point for the Spring Boot application that provides premium energy market
 * data visualization with sub-second performance.
 */
@SpringBootApplication
public class Application {

  /**
   * Main method to start the Energy Market Visualization Service.
   *
   * @param args command line arguments
   */
  public static void main(final String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
