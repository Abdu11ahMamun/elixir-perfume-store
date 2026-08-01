package com.elixir.service.customer.service.impl;

import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.customer.dto.CustomerResponse;
import com.elixir.service.customer.dto.CustomerUpdateRequest;
import com.elixir.service.customer.entity.Customer;
import com.elixir.service.customer.repository.CustomerRepository;
import com.elixir.service.customer.service.CustomerService;
import com.elixir.service.customertype.entity.CustomerType;
import com.elixir.service.customertype.repository.CustomerTypeRepository;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerTypeRepository customerTypeRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getById(Long id) {
        Customer customer = findById(id);
        List<Order> orders = orderRepository.findByCustomerPhoneAndDeletedAtIsNull(customer.getPhone());
        return toResponse(customer, orders);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAll() {
        List<Customer> customers = customerRepository.findAll()
                .stream()
                .filter(c -> c.getDeletedAt() == null)
                .toList();

        // Single pass over all orders instead of one query per customer.
        List<Order> allOrders = orderRepository.findAll()
                .stream()
                .filter(o -> o.getDeletedAt() == null)
                .toList();
        Map<String, List<Order>> ordersByPhone = allOrders.stream()
                .collect(Collectors.groupingBy(Order::getCustomerPhone));

        return customers.stream()
                .map(c -> toResponse(c, ordersByPhone.getOrDefault(c.getPhone(), List.of())))
                .toList();
    }

    @Override
    @Transactional
    public CustomerResponse update(Long id, CustomerUpdateRequest request) {
        Customer existing = findById(id);

        if (request.getName() != null) {
            existing.setName(request.getName());
        }
        if (request.getEmail() != null) {
            existing.setEmail(request.getEmail());
        }
        if (request.getDistrict() != null) {
            existing.setDistrict(request.getDistrict());
        }
        if (request.getUpazila() != null) {
            existing.setUpazila(request.getUpazila());
        }
        if (request.getAddress() != null) {
            existing.setAddress(request.getAddress());
        }

        // Always authoritative — the edit form sends the complete current
        // selection, including explicit null for "no type assigned".
        if (request.getCustomerTypeId() != null) {
            CustomerType type = customerTypeRepository.findById(request.getCustomerTypeId())
                    .filter(t -> t.getDeletedAt() == null)
                    .orElseThrow(() -> new ResourceNotFoundException("Customer type not found"));
            existing.setCustomerType(type);
        } else {
            existing.setCustomerType(null);
        }

        Customer saved = customerRepository.save(existing);
        List<Order> orders = orderRepository.findByCustomerPhoneAndDeletedAtIsNull(saved.getPhone());
        return toResponse(saved, orders);
    }

    @Override
    @Transactional
    public Customer recordOrder(Order order) {
        String phone = normalizePhone(order.getCustomerPhone());

        Customer customer = customerRepository.findByPhoneAndDeletedAtIsNull(phone).orElse(null);

        if (customer == null) {
            customer = new Customer();
            customer.setPhone(phone);
            applyOrderSnapshot(customer, order);
            customer.setActive(true);
            try {
                customer = customerRepository.saveAndFlush(customer);
            } catch (DataIntegrityViolationException raceLost) {
                // Another concurrent order for the same new phone number won
                // the insert race — fetch their row and update it instead of
                // creating a duplicate.
                customer = customerRepository.findByPhoneAndDeletedAtIsNull(phone)
                        .orElseThrow(() -> raceLost);
                applyOrderSnapshot(customer, order);
                customer.setActive(true);
                customer = customerRepository.save(customer);
            }
        } else {
            applyOrderSnapshot(customer, order);
            customer.setActive(true); // placing any new order makes them active again
            customer = customerRepository.save(customer);
        }

        return customer;
    }

    @Override
    @Transactional
    public void refreshActivityStatus(Order order) {
        String phone = normalizePhone(order.getCustomerPhone());
        Customer customer = customerRepository.findByPhoneAndDeletedAtIsNull(phone).orElse(null);
        if (customer == null) {
            return; // e.g. a historical order predating this feature
        }

        // Safer rule than "last order's status": a customer with several
        // orders shouldn't flip inactive just because ONE of them was
        // delivered while another is still in progress.
        List<Order> orders = orderRepository.findByCustomerPhoneAndDeletedAtIsNull(phone);
        boolean active = orders.stream().anyMatch(CustomerServiceImpl::isNonTerminal);

        if (!Objects.equals(customer.getActive(), active)) {
            customer.setActive(active);
            customerRepository.save(customer);
        }
    }

    /**
     * Terminal = DELIVERED or CANCELLED (see OrderServiceImpl's
     * ORDER_STATUS_TRANSITIONS — both map to an empty next-status set).
     * DELIVERED is the only status representing a completed delivery in
     * this codebase; there is no separate RECEIVED/COMPLETED status. It
     * remains a valid backend status (kept for the data model and the
     * dashboard's revenue query) even though a prior sprint removed it from
     * the admin edit UI's selectable dropdown — that UI change doesn't
     * affect this rule.
     */
    private static boolean isNonTerminal(Order order) {
        OrderStatus status = order.getOrderStatus();
        return status != OrderStatus.DELIVERED && status != OrderStatus.CANCELLED;
    }

    private void applyOrderSnapshot(Customer customer, Order order) {
        if (order.getCustomerName() != null && !order.getCustomerName().isBlank()) {
            customer.setName(order.getCustomerName());
        }
        // Email is optional per order — don't blank out a previously known
        // address just because this particular order omitted it.
        if (order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()) {
            customer.setEmail(order.getCustomerEmail());
        }
        if (order.getDeliveryDistrict() != null && !order.getDeliveryDistrict().isBlank()) {
            customer.setDistrict(order.getDeliveryDistrict());
        }
        customer.setUpazila(order.getDeliveryUpazila()); // legitimately nullable (district-wide)
        if (order.getDeliveryAddress() != null && !order.getDeliveryAddress().isBlank()) {
            customer.setAddress(order.getDeliveryAddress());
        }
    }

    /**
     * Normalizes cosmetic phone variations (spaces, hyphens, parens) so the
     * same logical number always maps to the same customer row. Does not
     * attempt to unify local (01...) vs international (+8801...) formats —
     * the checkout form already asks for the international format, and
     * guessing at country-code rewriting risks merging genuinely different
     * numbers.
     */
    private String normalizePhone(String phone) {
        if (phone == null) return null;
        return phone.replaceAll("[\\s()-]", "").trim();
    }

    private Customer findById(Long id) {
        return customerRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    private CustomerResponse toResponse(Customer customer, List<Order> orders) {
        CustomerResponse response = new CustomerResponse();
        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setDistrict(customer.getDistrict());
        response.setUpazila(customer.getUpazila());
        response.setAddress(customer.getAddress());
        response.setActive(customer.getActive());

        CustomerType type = customer.getCustomerType();
        if (type != null) {
            response.setCustomerTypeId(type.getId());
            response.setCustomerTypeName(type.getName());
        }

        response.setTotalOrders(orders.size());
        response.setTotalSpent(orders.stream()
                .map(Order::getGrandTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        response.setFirstOrderAt(orders.stream()
                .map(Order::getCreatedAt)
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null));
        response.setLastOrderAt(orders.stream()
                .map(Order::getCreatedAt)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null));

        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }
}
