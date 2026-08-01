package com.elixir.service.publicapi.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.delivery.dto.DeliveryChargeResponse;
import com.elixir.service.delivery.service.DeliveryAreaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/delivery-areas")
@Tag(name = "Public Delivery Areas", description = "Public delivery location browsing APIs")
public class PublicDeliveryController {

    private final DeliveryAreaService deliveryAreaService;

    @GetMapping("/districts")
    @Operation(summary = "List deliverable districts", description = "Returns districts with at least one active delivery area.")
    public ResponseEntity<ApiResponse<List<String>>> getDistricts(HttpServletRequest request) {
        List<String> districts = deliveryAreaService.getActiveDistricts();

        return ResponseEntity.ok(
                ApiResponse.success("Districts retrieved successfully", districts, request.getRequestURI())
        );
    }

    @GetMapping("/districts/{district}/upazilas")
    @Operation(summary = "List upazilas for a district", description = "Returns upazilas with a specific active delivery charge for the given district.")
    public ResponseEntity<ApiResponse<List<String>>> getUpazilas(
            @PathVariable String district,
            HttpServletRequest request
    ) {
        List<String> upazilas = deliveryAreaService.getActiveUpazilas(district);

        return ResponseEntity.ok(
                ApiResponse.success("Upazilas retrieved successfully", upazilas, request.getRequestURI())
        );
    }

    @GetMapping("/charge")
    @Operation(summary = "Resolve delivery charge", description = "Returns the applicable delivery charge for a district (and optional upazila).")
    public ResponseEntity<ApiResponse<DeliveryChargeResponse>> getCharge(
            @RequestParam String district,
            @RequestParam(required = false) String upazila,
            HttpServletRequest request
    ) {
        DeliveryChargeResponse charge = deliveryAreaService.resolveCharge(district, upazila);

        return ResponseEntity.ok(
                ApiResponse.success("Delivery charge retrieved successfully", charge, request.getRequestURI())
        );
    }
}
