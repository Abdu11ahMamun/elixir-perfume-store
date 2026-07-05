package com.elixir.service.publicapi.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderResponse;
import com.elixir.service.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/orders")
public class PublicOrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @Valid @RequestBody OrderCreateRequest requestBody,
            HttpServletRequest request
    ) {
        OrderResponse order = orderService.placeOrder(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "Order placed successfully",
                        order,
                        request.getRequestURI()
                ));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable String orderNumber,
            HttpServletRequest request
    ) {
        OrderResponse order = orderService.getByOrderNumber(orderNumber);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order retrieved successfully",
                        order,
                        request.getRequestURI()
                )
        );
    }
}