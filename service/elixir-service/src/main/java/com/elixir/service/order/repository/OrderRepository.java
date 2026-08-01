package com.elixir.service.order.repository;

import com.elixir.service.order.entity.Order;
import com.elixir.service.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.elixir.service.order.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

	Optional<Order> findByOrderNumber(String orderNumber);

	List<Order> findByCustomer(User customer);

	List<Order> findByCustomerPhone(String customerPhone);

	List<Order> findByCustomerPhoneAndDeletedAtIsNull(String customerPhone);

	long countByDeletedAtIsNull();

	long countByOrderStatusAndDeletedAtIsNull(OrderStatus orderStatus);

	List<Order> findByOrderStatusAndDeletedAtIsNull(OrderStatus orderStatus);

	// ─── Reporting aggregates (Reports module) ─────────────────────────
	// DB-side SUM/COUNT/GROUP BY rather than pulling entities into memory,
	// since report ranges can span arbitrary numbers of orders.

	@Query("SELECT COUNT(o) FROM Order o WHERE o.deletedAt IS NULL AND o.createdAt >= :start AND o.createdAt < :end")
	long countAllInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	@Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = :status AND o.deletedAt IS NULL AND o.createdAt >= :start AND o.createdAt < :end")
	long countByStatusInRange(@Param("status") OrderStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	@Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.orderStatus = :status AND o.deletedAt IS NULL AND o.createdAt >= :start AND o.createdAt < :end")
	BigDecimal sumGrandTotalByStatusInRange(@Param("status") OrderStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	@Query("SELECT COUNT(DISTINCT o.customerPhone) FROM Order o WHERE o.deletedAt IS NULL AND o.createdAt >= :start AND o.createdAt < :end")
	long countDistinctCustomersInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	// One row per calendar day that has at least one order of the given
	// status — days with none are absent and zero-filled by the service.
	// FUNCTION('DATE', ...) is Hibernate's portable JPQL function
	// passthrough (not native SQL) used because JPQL has no built-in
	// date-truncation operator.
	@Query("SELECT FUNCTION('DATE', o.createdAt), SUM(o.grandTotal), COUNT(o) " +
			"FROM Order o WHERE o.orderStatus = :status AND o.deletedAt IS NULL " +
			"AND o.createdAt >= :start AND o.createdAt < :end " +
			"GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY FUNCTION('DATE', o.createdAt)")
	List<Object[]> dailyRevenueInRange(@Param("status") OrderStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	// All non-deleted orders regardless of status — payment method is a
	// placement-time choice, not tied to order completion.
	@Query("SELECT o.paymentMethod, COUNT(o), COALESCE(SUM(o.grandTotal), 0) " +
			"FROM Order o WHERE o.deletedAt IS NULL AND o.createdAt >= :start AND o.createdAt < :end " +
			"GROUP BY o.paymentMethod ORDER BY COUNT(o) DESC")
	List<Object[]> paymentBreakdownInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
