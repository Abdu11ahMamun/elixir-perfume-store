package com.elixir.service.delivery.service;

import com.elixir.service.delivery.dto.DeliveryAreaCreateRequest;
import com.elixir.service.delivery.dto.DeliveryAreaResponse;
import com.elixir.service.delivery.dto.DeliveryAreaUpdateRequest;
import com.elixir.service.delivery.dto.DeliveryChargeResponse;

import java.util.List;

public interface DeliveryAreaService {

    DeliveryAreaResponse getById(Long id);

    List<DeliveryAreaResponse> getAll();

    DeliveryAreaResponse create(DeliveryAreaCreateRequest request);

    DeliveryAreaResponse update(Long id, DeliveryAreaUpdateRequest request);

    DeliveryAreaResponse toggleStatus(Long id);

    void delete(Long id);

    // ── Public-facing lookups (active + non-deleted only) ──

    List<String> getActiveDistricts();

    List<String> getActiveUpazilas(String district);

    DeliveryChargeResponse resolveCharge(String district, String upazila);
}
