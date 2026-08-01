package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.delivery.dto.DeliveryAreaCreateRequest;
import com.elixir.service.delivery.dto.DeliveryAreaResponse;
import com.elixir.service.delivery.dto.DeliveryAreaUpdateRequest;
import com.elixir.service.delivery.service.DeliveryAreaService;
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
@RequestMapping("/api/v1/admin/delivery-areas")
@Tag(name = "Admin Delivery Areas", description = "Admin delivery area management APIs")
public class AdminDeliveryAreaController {

    private final DeliveryAreaService deliveryAreaService;

    @GetMapping
    @Operation(summary = "Get all delivery areas", description = "Returns all admin delivery areas.")
    public ResponseEntity<ApiResponse<List<DeliveryAreaResponse>>> getAllDeliveryAreas(
            HttpServletRequest request
    ) {
        List<DeliveryAreaResponse> areas = deliveryAreaService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery areas retrieved successfully",
                        areas,
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get delivery area by id", description = "Returns a delivery area by id.")
    public ResponseEntity<ApiResponse<DeliveryAreaResponse>> getDeliveryAreaById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        DeliveryAreaResponse area = deliveryAreaService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery area retrieved successfully",
                        area,
                        request.getRequestURI()
                )
        );
    }

    @PostMapping
    @Operation(summary = "Create delivery area", description = "Creates a new delivery area.")
    public ResponseEntity<ApiResponse<DeliveryAreaResponse>> createDeliveryArea(
            @Valid @RequestBody DeliveryAreaCreateRequest requestBody,
            HttpServletRequest request
    ) {
        DeliveryAreaResponse area = deliveryAreaService.create(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "Delivery area created successfully",
                        area,
                        request.getRequestURI()
                ));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update delivery area", description = "Updates an existing delivery area.")
    public ResponseEntity<ApiResponse<DeliveryAreaResponse>> updateDeliveryArea(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryAreaUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        DeliveryAreaResponse area = deliveryAreaService.update(id, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery area updated successfully",
                        area,
                        request.getRequestURI()
                )
        );
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle delivery area status", description = "Toggles the delivery area active status.")
    public ResponseEntity<ApiResponse<DeliveryAreaResponse>> toggleDeliveryAreaStatus(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        DeliveryAreaResponse area = deliveryAreaService.toggleStatus(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery area status updated successfully",
                        area,
                        request.getRequestURI()
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete delivery area", description = "Deletes a delivery area.")
    public ResponseEntity<Void> deleteDeliveryArea(@PathVariable Long id) {
        deliveryAreaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
