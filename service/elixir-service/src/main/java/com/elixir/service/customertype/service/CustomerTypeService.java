package com.elixir.service.customertype.service;

import com.elixir.service.customertype.dto.CustomerTypeCreateRequest;
import com.elixir.service.customertype.dto.CustomerTypeResponse;
import com.elixir.service.customertype.dto.CustomerTypeUpdateRequest;

import java.util.List;

public interface CustomerTypeService {

    CustomerTypeResponse getById(Long id);

    List<CustomerTypeResponse> getAll();

    List<CustomerTypeResponse> getActive();

    CustomerTypeResponse create(CustomerTypeCreateRequest request);

    CustomerTypeResponse update(Long id, CustomerTypeUpdateRequest request);

    CustomerTypeResponse toggleStatus(Long id);

    void delete(Long id);
}
