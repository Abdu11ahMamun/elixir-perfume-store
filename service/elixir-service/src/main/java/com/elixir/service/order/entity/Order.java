package com.elixir.service.order.entity;

import com.elixir.service.common.entity.BaseEntity;
import com.elixir.service.customer.entity.Customer;
import com.elixir.service.delivery.entity.DeliveryArea;
import com.elixir.service.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "orders",
        indexes = {
                @Index(name = "idx_orders_order_number", columnList = "order_number"),
                @Index(name = "idx_orders_customer", columnList = "customer_id"),
                @Index(name = "idx_orders_customer_phone", columnList = "customer_phone"),
                @Index(name = "idx_orders_status", columnList = "order_status"),
                @Index(name = "idx_orders_created_at", columnList = "created_at")
        }
)
public class Order extends BaseEntity {

    @Column(name = "order_number", nullable = false, unique = true, length = 30)
    private String orderNumber;

    // Legacy FK to the admin/login User entity — never actually populated
    // (checkout is guest-only, see OrderServiceImpl.placeOrder). Left as-is;
    // customerRef below is the real link used by the Sprint 6 customer
    // feature, since Customer is a separate domain from the login User.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_ref_id")
    private Customer customerRef;

    @Column(name = "customer_name", nullable = false, length = 120)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 150)
    private String customerEmail;

    @Column(name = "delivery_address", nullable = false, columnDefinition = "TEXT")
    private String deliveryAddress;

    // District/upazila are snapshotted as plain text (like order_items'
    // product_name_snapshot) so an order keeps showing what was selected at
    // placement time even if the delivery area is later renamed or removed.
    @Column(name = "delivery_district", length = 100)
    private String deliveryDistrict;

    @Column(name = "delivery_upazila", length = 100)
    private String deliveryUpazila;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_area_id")
    private DeliveryArea deliveryArea;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 30)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 30)
    private OrderStatus orderStatus;

    @Column(name = "priority", nullable = false, columnDefinition = "TINYINT")
    private Integer priority;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "delivery_charge", nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Column(name = "discount", nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "grand_total", nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal grandTotal = BigDecimal.ZERO;
}
