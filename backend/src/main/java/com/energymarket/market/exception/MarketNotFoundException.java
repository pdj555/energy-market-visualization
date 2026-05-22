package com.energymarket.market.exception;

/**
 * Thrown when a requested market code does not match the supported catalogue.
 */
public class MarketNotFoundException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  public MarketNotFoundException(String code) {
    super("Unknown market code: " + code);
  }
}
