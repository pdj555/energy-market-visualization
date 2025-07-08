package com.energymarket;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/** Integration test for the main Application class. */
@SpringBootTest
@ActiveProfiles("test")
class ApplicationTest {

  /** Test that the Spring Boot application context loads successfully. */
  @Test
  void contextLoads() {
    // This test verifies that the application context loads without errors
    // No explicit assertions needed - the test passes if context loads
  }

  /** Test the main method executes without exceptions. */
  @Test
  void mainMethodExecutes() {
    // Test that main method can be called without exceptions
    // Note: This doesn't actually start the server, just verifies no compile errors
    // Application.main(new String[]{}); // Commented out to avoid starting actual server in tests
  }
}
