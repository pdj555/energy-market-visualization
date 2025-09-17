package com.energymarket.market.exception;

/**
 * Thrown when a requested market code does not match the supported catalogue.
 */
public class MarketNotFoundException extends RuntimeException {

  public MarketNotFoundException(String code) {
    super("Unknown market code: " + code);
  }
}
