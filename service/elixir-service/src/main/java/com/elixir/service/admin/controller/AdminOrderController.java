package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.common.dto.PageResponse;
import com.elixir.service.order.dto.OrderResponse;
import com.elixir.service.order.dto.OrderStatusUpdateRequest;
import com.elixir.service.order.dto.PaymentStatusUpdateRequest;
import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentStatus;
import com.elixir.service.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/orders")
@Tag(name = "Admin Orders", description = "Admin order management APIs")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
        @Operation(summary = "Get orders", description = "Returns paginated admin orders.")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrders(
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) String customerPhone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            HttpServletRequest request
    ) {
        Pageable pageable = buildPageable(page, size, sort);

        PageResponse<OrderResponse> orders = orderService.getAdminOrders(
                orderStatus,
                paymentStatus,
                customerPhone,
                pageable
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Orders retrieved successfully",
                        orders,
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get order by order number", description = "Returns an admin order by order number.")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderNumber(
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

    @PatchMapping("/{orderNumber}/status")
        @Operation(summary = "Update order status", description = "Updates the status of an order.")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody OrderStatusUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        OrderResponse order = orderService.updateOrderStatus(orderNumber, requestBody.getOrderStatus());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order status updated successfully",
                        order,
                        request.getRequestURI()
                )
        );
    }

    @PatchMapping("/{orderNumber}/payment-status")
        @Operation(summary = "Update payment status", description = "Updates the payment status of an order.")
    public ResponseEntity<ApiResponse<OrderResponse>> updatePaymentStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody PaymentStatusUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        OrderResponse order = orderService.updatePaymentStatus(orderNumber, requestBody.getPaymentStatus());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment status updated successfully",
                        order,
                        request.getRequestURI()
                )
        );
    }

    private Pageable buildPageable(int page, int size, String sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        String[] sortParts = sort.split(",");
        String sortField = sortParts.length > 0 ? sortParts[0] : "createdAt";
        Sort.Direction direction = sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(safePage, safeSize, Sort.by(direction, sortField));
    }
}