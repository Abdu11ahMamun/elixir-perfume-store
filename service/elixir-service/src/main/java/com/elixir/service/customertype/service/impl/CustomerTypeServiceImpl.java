package com.elixir.service.customertype.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.customertype.dto.CustomerTypeCreateRequest;
import com.elixir.service.customertype.dto.CustomerTypeResponse;
import com.elixir.service.customertype.dto.CustomerTypeUpdateRequest;
import com.elixir.service.customertype.entity.CustomerType;
import com.elixir.service.customertype.repository.CustomerTypeRepository;
import com.elixir.service.customertype.service.CustomerTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerTypeServiceImpl implements CustomerTypeService {

    private final CustomerTypeRepository customerTypeRepository;

    @Override
    @Transactional(readOnly = true)
    public CustomerTypeResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerTypeResponse> getAll() {
        return customerTypeRepository.findAll()
                .stream()
                .filter(type -> type.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerTypeResponse> getActive() {
        return customerTypeRepository.findByActiveTrueAndDeletedAtIsNullOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CustomerTypeResponse create(CustomerTypeCreateRequest request) {
        if (customerTypeRepository.existsByNameAndDeletedAtIsNull(request.getName())) {
            throw new DuplicateResourceException("Customer type \"" + request.getName() + "\" already exists");
        }

        CustomerType type = new CustomerType();
        type.setName(request.getName());
        type.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        type.setActive(request.getActive() == null || request.getActive());

        return toResponse(customerTypeRepository.save(type));
    }

    @Override
    @Transactional
    public CustomerTypeResponse update(Long id, CustomerTypeUpdateRequest request) {
        CustomerType existing = findById(id);

        if (request.getName() != null
                && !request.getName().equals(existing.getName())
                && customerTypeRepository.existsByNameAndDeletedAtIsNull(request.getName())) {
            throw new DuplicateResourceException("Customer type \"" + request.getName() + "\" already exists");
        }

        if (request.getName() != null) {
            existing.setName(request.getName());
        }
        if (request.getDisplayOrder() != null) {
            existing.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        return toResponse(customerTypeRepository.save(existing));
    }

    @Override
    @Transactional
    public CustomerTypeResponse toggleStatus(Long id) {
        CustomerType existing = findById(id);
        existing.setActive(!Boolean.TRUE.equals(existing.getActive()));
        return toResponse(customerTypeRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        CustomerType existing = findById(id);
        existing.setDeletedAt(LocalDateTime.now());
        customerTypeRepository.save(existing);
    }

    private CustomerType findById(Long id) {
        return customerTypeRepository.findById(id)
                .filter(type -> type.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Customer type not found"));
    }

    private CustomerTypeResponse toResponse(CustomerType type) {
        CustomerTypeResponse response = new CustomerTypeResponse();
        response.setId(type.getId());
        response.setName(type.getName());
        response.setDisplayOrder(type.getDisplayOrder());
        response.setActive(type.getActive());
        response.setCreatedAt(type.getCreatedAt());
        response.setUpdatedAt(type.getUpdatedAt());
        return response;
    }
}
