package com.elixir.service.order.repository;

import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;
import com.elixir.service.order.entity.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);

    // ─── Reporting aggregates (Reports module) ─────────────────────────
    // Category/product names come from the CURRENT Product/Category
    // relation, not a point-in-time snapshot (OrderItem only snapshots the
    // product name and ml, not category) — if a product is recategorized
    // later, past-period reports will reflect the new category.

    @Query("SELECT p.category.id, p.category.name, SUM(oi.lineTotal), SUM(oi.quantity) " +
            "FROM OrderItem oi JOIN oi.productSize ps JOIN ps.product p " +
            "WHERE oi.order.orderStatus = :status AND oi.order.deletedAt IS NULL " +
            "AND oi.order.createdAt >= :start AND oi.order.createdAt < :end " +
            "GROUP BY p.category.id, p.category.name ORDER BY SUM(oi.lineTotal) DESC")
    List<Object[]> categoryBreakdownInRange(@Param("status") OrderStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // MAX(productNameSnapshot) picks one deterministic display name per
    // product without fragmenting totals if a product's snapshotted name
    // ever changed between orders — grouping itself is by product.id, the
    // correct stable identity key.
    @Query("SELECT p.id, MAX(oi.productNameSnapshot), p.category.name, SUM(oi.quantity), SUM(oi.lineTotal) " +
            "FROM OrderItem oi JOIN oi.productSize ps JOIN ps.product p " +
            "WHERE oi.order.orderStatus = :status AND oi.order.deletedAt IS NULL " +
            "AND oi.order.createdAt >= :start AND oi.order.createdAt < :end " +
            "GROUP BY p.id, p.category.name ORDER BY SUM(oi.lineTotal) DESC")
    List<Object[]> topProductsInRange(@Param("status") OrderStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, Pageable pageable);
}
