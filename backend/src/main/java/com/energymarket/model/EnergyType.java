package com.energymarket.model;

/**
 * Enum representing different types of energy sources in the market.
 */
public enum EnergyType {
  ELECTRICITY("Electricity", "MWh"),
  GAS("Natural Gas", "MMBtu"),
  COAL("Coal", "MT"),
  SOLAR("Solar", "MWh"),
  WIND("Wind", "MWh"),
  NUCLEAR("Nuclear", "MWh"),
  HYDRO("Hydro", "MWh");

  private final String displayName;
  private final String unit;

  EnergyType(final String displayName, final String unit) {
    this.displayName = displayName;
    this.unit = unit;
  }

  public String getDisplayName() {
    return displayName;
  }

  public String getUnit() {
    return unit;
  }
}