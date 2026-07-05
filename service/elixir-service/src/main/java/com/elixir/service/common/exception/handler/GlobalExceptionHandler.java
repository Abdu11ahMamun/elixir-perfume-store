package com.elixir.service.common.exception.handler;

import com.elixir.service.common.dto.ApiErrorResponse;
import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.elixir.service.common.exception.InvalidCredentialsException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
        ResourceNotFoundException exception,
        HttpServletRequest request
    ) {
    return buildResponse(
        HttpStatus.NOT_FOUND,
        exception.getMessage(),
        request,
        null
    );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateResource(
        DuplicateResourceException exception,
        HttpServletRequest request
    ) {
    log.warn("Duplicate resource request: path={}, message={}", request.getRequestURI(), exception.getMessage());

    return buildResponse(
        HttpStatus.CONFLICT,
        exception.getMessage(),
        request,
        null
    );
    }

    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessValidation(
        BusinessValidationException exception,
        HttpServletRequest request
    ) {
    return buildResponse(
        HttpStatus.BAD_REQUEST,
        exception.getMessage(),
        request,
        null
    );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {
    Map<String, String> validationErrors = new LinkedHashMap<>();

    for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
        validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
    }

    return buildResponse(
        HttpStatus.BAD_REQUEST,
        "Validation failed",
        request,
        validationErrors
    );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
        ConstraintViolationException exception,
        HttpServletRequest request
    ) {
    Map<String, String> validationErrors = new LinkedHashMap<>();

    exception.getConstraintViolations().forEach(violation ->
        validationErrors.put(
            violation.getPropertyPath().toString(),
            violation.getMessage()
        )
    );

    return buildResponse(
        HttpStatus.BAD_REQUEST,
        "Validation failed",
        request,
        validationErrors
    );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(
        HttpMessageNotReadableException exception,
        HttpServletRequest request
    ) {
    return buildResponse(
        HttpStatus.BAD_REQUEST,
        "Malformed request body",
        request,
        null
    );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(
        Exception exception,
        HttpServletRequest request
    ) {
    log.error("Unexpected server error: path={}", request.getRequestURI(), exception);

    return buildResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred. Please try again later.",
        request,
        null
    );
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request,
        Map<String, String> validationErrors
    ) {
    ApiErrorResponse response = ApiErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .status(status.value())
        .error(status.getReasonPhrase())
        .message(message)
        .path(request.getRequestURI())
        .validationErrors(validationErrors)
        .build();

    return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password",
                request,
                null
        );
    }
}
