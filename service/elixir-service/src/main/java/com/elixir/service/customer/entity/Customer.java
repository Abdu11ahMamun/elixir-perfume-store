package com.elixir.service.customer.entity;

import com.elixir.service.common.entity.BaseEntity;
import com.elixir.service.customertype.entity.CustomerType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A storefront buyer, generated/kept in sync from order data (guest
 * checkout — there is no customer login/registration flow). Phone is the
 * unique identity; it is intentionally not editable once a customer exists
 * (see CustomerUpdateRequest) since order history is joined by phone.
 *
 * Order-derived stats (total orders, total spent, first/last order date)
 * are deliberately NOT stored here — they're computed live from the
 * customer's orders in CustomerServiceImpl so they can never drift out of
 * sync, and "active" is likewise fully recomputed from order state rather
 * than a value this entity owns independently (see CustomerServiceImpl for
 * the exact rule).
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "phone", nullable = false, unique = true, length = 20)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "upazila", length = 100)
    private String upazila;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_type_id")
    private CustomerType customerType;

    @Column(name = "active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active = true;
}
