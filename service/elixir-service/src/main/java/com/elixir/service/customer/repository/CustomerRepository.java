package com.elixir.service.customer.repository;

import com.elixir.service.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByPhoneAndDeletedAtIsNull(String phone);
}
