package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.customer.dto.CustomerResponse;
import com.elixir.service.customer.dto.CustomerUpdateRequest;
import com.elixir.service.customer.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/customers")
@Tag(name = "Admin Customers", description = "Admin customer management APIs")
public class AdminCustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get all customers", description = "Returns all customers generated from placed orders.")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers(
            HttpServletRequest request
    ) {
        List<CustomerResponse> customers = customerService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success("Customers retrieved successfully", customers, request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by id", description = "Returns a customer profile by id.")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        CustomerResponse customer = customerService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Customer retrieved successfully", customer, request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer", description = "Updates a customer's profile fields (not phone or active status).")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        CustomerResponse customer = customerService.update(id, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success("Customer updated successfully", customer, request.getRequestURI())
        );
    }
}
