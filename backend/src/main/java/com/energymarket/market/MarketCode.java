package com.energymarket.market;

import com.energymarket.market.model.MarketMetadata;
import java.util.Arrays;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

/**
 * Enumeration of the synthetic markets supported by the demo service.
 */
public enum MarketCode {
  CAISO(
      "CAISO",
      "California ISO Day-Ahead",
      "US West Coast",
      "America/Los_Angeles",
      "High solar penetration with daily two-peak demand curves.",
      new MarketParameters(75.0, 20.0, 7.0, 5.1, 0.7, 28000.0, 5000.0, 280.0, 25.0, 56.0, 15.0)),
  ERCOT(
      "ERCOT",
      "ERCOT Real-Time Hub",
      "Texas Interconnection",
      "America/Chicago",
      "Weather-sensitive grid with rapid ramping requirements.",
      new MarketParameters(70.0, 22.0, 8.0, 6.0, 1.2, 48000.0, 9000.0, 420.0, 45.0, 32.0, 18.0)),
  MISO(
      "MISO",
      "MISO North Hub",
      "Midcontinent",
      "America/Chicago",
      "Wind-driven supply mix with large geographic footprint.",
      new MarketParameters(60.0, 14.0, 5.0, 3.8, 0.5, 42000.0, 7200.0, 360.0, 28.0, 38.0, 10.0)),
  NEISO(
      "NEISO",
      "ISO New England Hub",
      "New England",
      "America/New_York",
      "Tight reserve margins and significant winter peak risk.",
      new MarketParameters(85.0, 18.0, 6.5, 4.5, 0.8, 16500.0, 3200.0, 310.0, 35.0, 48.0, 12.0)),
  PJM(
      "PJM",
      "PJM Western Hub",
      "US Mid-Atlantic",
      "America/New_York",
      "Largest ISO with diverse generation fleet and congestion dynamics.",
      new MarketParameters(65.0, 15.0, 5.5, 4.2, 0.6, 58000.0, 10500.0, 410.0, 30.0, 28.0, 8.0));

  private final String code;
  private final String name;
  private final String region;
  private final String timezone;
  private final String description;
  private final MarketParameters parameters;

  MarketCode(
      String code,
      String name,
      String region,
      String timezone,
      String description,
      MarketParameters parameters) {
    this.code = code;
    this.name = name;
    this.region = region;
    this.timezone = timezone;
    this.description = description;
    this.parameters = parameters;
  }

  public String code() {
    return code;
  }

  public String name() {
    return name;
  }

  public String region() {
    return region;
  }

  public String timezone() {
    return timezone;
  }

  public String description() {
    return description;
  }

  public MarketParameters parameters() {
    return parameters;
  }

  /**
   * Converts a textual market code to the enum instance in a case-insensitive manner.
   *
   * @param value the value to parse
   * @return the matching market code, or empty if the value is unknown
   */
  public static Optional<MarketCode> fromCode(String value) {
    if (value == null) {
      return Optional.empty();
    }
    final String normalized = value.trim().toUpperCase(Locale.US);
    return Arrays.stream(values()).filter(code -> Objects.equals(code.code, normalized)).findFirst();
  }

  /**
   * Creates a lightweight metadata view used by clients to render selectors and contextual text.
   *
   * @return immutable metadata record
   */
  public MarketMetadata toMetadata() {
    return new MarketMetadata(code, name, region, timezone, description, parameters.basePrice());
  }

  @Override
  public String toString() {
    return code;
  }

  /**
   * Domain-specific tuning parameters that drive the synthetic dataset for each market.
   */
  public record MarketParameters(
      double basePrice,
      double dailySwing,
      double weeklySwing,
      double volatility,
      double trendSlope,
      double demandBase,
      double demandSwing,
      double carbonBase,
      double carbonSwing,
      double renewableBase,
      double renewableSwing) {}
}
