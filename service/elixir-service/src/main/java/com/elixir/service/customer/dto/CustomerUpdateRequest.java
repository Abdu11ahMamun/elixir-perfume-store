package com.elixir.service.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Deliberately excludes `phone` and `active`:
 * - phone is the customer's join key against order history and is treated
 *   as immutable once a customer record exists (see CustomerServiceImpl).
 * - active is fully computed from order status (client rule: active while
 *   any order is non-terminal), not an admin-editable field.
 */
@Getter
@Setter
@NoArgsConstructor
public class CustomerUpdateRequest {
    @Size(max = 120)
    private String name;

    @Email
    @Size(max = 150)
    private String email;

    @Size(max = 100)
    private String district;

    @Size(max = 100)
    private String upazila;

    private String address;

    // Always treated as authoritative (not "apply only if non-null" like the
    // other fields) — the admin edit form always sends the complete current
    // selection, including explicit null for "no type assigned".
    private Long customerTypeId;
}
