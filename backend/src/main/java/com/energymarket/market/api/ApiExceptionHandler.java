package com.energymarket.market.api;

import com.energymarket.market.exception.MarketNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centralised error handling for the market API, returning RFC7807 responses.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(MarketNotFoundException.class)
  public ProblemDetail handleMarketNotFound(MarketNotFoundException exception) {
    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
    problem.setTitle("Market not found");
    problem.setDetail(exception.getMessage());
    return problem;
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ProblemDetail handleIllegalArgument(IllegalArgumentException exception) {
    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
    problem.setTitle("Invalid request parameter");
    problem.setDetail(exception.getMessage());
    return problem;
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ProblemDetail handleConstraintViolation(ConstraintViolationException exception) {
    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
    problem.setTitle("Validation failed");
    problem.setDetail("Request parameters failed validation");
    Map<String, String> violations =
        exception.getConstraintViolations().stream()
            .collect(
                Collectors.toMap(
                    ApiExceptionHandler::extractViolationProperty,
                    ConstraintViolation::getMessage));
    problem.setProperty("violations", violations);
    return problem;
  }

  private static String extractViolationProperty(ConstraintViolation<?> violation) {
    String path = violation.getPropertyPath().toString();
    int lastDot = path.lastIndexOf('.');
    return lastDot >= 0 ? path.substring(lastDot + 1) : path;
  }
}
