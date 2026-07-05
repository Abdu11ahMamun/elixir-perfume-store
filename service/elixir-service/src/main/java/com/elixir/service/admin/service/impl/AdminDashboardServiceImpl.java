package com.elixir.service.admin.service.impl;

import com.elixir.service.admin.dto.AdminDashboardSummaryResponse;
import com.elixir.service.admin.service.AdminDashboardService;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.product.entity.ProductStatus;
import com.elixir.service.product.repository.ProductRepository;
import com.elixir.service.user.entity.UserRole;
import com.elixir.service.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardSummaryResponse getSummary() {
        AdminDashboardSummaryResponse response = new AdminDashboardSummaryResponse();

        response.setTotalProducts(productRepository.countByDeletedAtIsNull());
        response.setActiveProducts(productRepository.countByStatusAndDeletedAtIsNull(ProductStatus.ACTIVE));

        response.setTotalOrders(orderRepository.countByDeletedAtIsNull());
        response.setPendingOrders(orderRepository.countByOrderStatusAndDeletedAtIsNull(OrderStatus.PENDING));

        BigDecimal totalRevenue = orderRepository.findByOrderStatusAndDeletedAtIsNull(OrderStatus.DELIVERED)
                .stream()
                .map(Order::getGrandTotal)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        response.setTotalRevenue(totalRevenue);

        response.setTotalCustomers(userRepository.countByRoleAndDeletedAtIsNull(UserRole.CUSTOMER));

        return response;
    }
}