package com.elixir.service.customer.service;

import com.elixir.service.customer.dto.CustomerResponse;
import com.elixir.service.customer.dto.CustomerUpdateRequest;
import com.elixir.service.customer.entity.Customer;
import com.elixir.service.order.entity.Order;

import java.util.List;

public interface CustomerService {

    CustomerResponse getById(Long id);

    List<CustomerResponse> getAll();

    CustomerResponse update(Long id, CustomerUpdateRequest request);

    /**
     * Finds the customer matching this order's phone (creating one if none
     * exists), refreshes their profile from the order's snapshot fields,
     * and marks them active. Called by OrderServiceImpl right before the
     * order itself is saved, so the returned Customer can be attached as
     * the order's customerRef in the same save.
     */
    Customer recordOrder(Order order);

    /**
     * Recomputes and persists a customer's active flag from their current
     * order history. Called by OrderServiceImpl after any order status
     * change. See CustomerServiceImpl for the exact rule.
     */
    void refreshActivityStatus(Order order);
}
