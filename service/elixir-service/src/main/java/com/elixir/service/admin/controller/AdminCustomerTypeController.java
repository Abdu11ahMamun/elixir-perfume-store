package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.customertype.dto.CustomerTypeCreateRequest;
import com.elixir.service.customertype.dto.CustomerTypeResponse;
import com.elixir.service.customertype.dto.CustomerTypeUpdateRequest;
import com.elixir.service.customertype.service.CustomerTypeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/customer-types")
@Tag(name = "Admin Customer Types", description = "Admin customer type management APIs")
public class AdminCustomerTypeController {

    private final CustomerTypeService customerTypeService;

    @GetMapping
    @Operation(summary = "Get all customer types", description = "Returns all admin customer types.")
    public ResponseEntity<ApiResponse<List<CustomerTypeResponse>>> getAllCustomerTypes(
            HttpServletRequest request
    ) {
        List<CustomerTypeResponse> types = customerTypeService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success("Customer types retrieved successfully", types, request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer type by id", description = "Returns a customer type by id.")
    public ResponseEntity<ApiResponse<CustomerTypeResponse>> getCustomerTypeById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        CustomerTypeResponse type = customerTypeService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Customer type retrieved successfully", type, request.getRequestURI())
        );
    }

    @PostMapping
    @Operation(summary = "Create customer type", description = "Creates a new customer type.")
    public ResponseEntity<ApiResponse<CustomerTypeResponse>> createCustomerType(
            @Valid @RequestBody CustomerTypeCreateRequest requestBody,
            HttpServletRequest request
    ) {
        CustomerTypeResponse type = customerTypeService.create(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Customer type created successfully", type, request.getRequestURI()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer type", description = "Updates an existing customer type.")
    public ResponseEntity<ApiResponse<CustomerTypeResponse>> updateCustomerType(
            @PathVariable Long id,
            @Valid @RequestBody CustomerTypeUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        CustomerTypeResponse type = customerTypeService.update(id, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success("Customer type updated successfully", type, request.getRequestURI())
        );
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle customer type status", description = "Toggles the customer type active status.")
    public ResponseEntity<ApiResponse<CustomerTypeResponse>> toggleCustomerTypeStatus(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        CustomerTypeResponse type = customerTypeService.toggleStatus(id);

        return ResponseEntity.ok(
                ApiResponse.success("Customer type status updated successfully", type, request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer type", description = "Deletes a customer type.")
    public ResponseEntity<Void> deleteCustomerType(@PathVariable Long id) {
        customerTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
