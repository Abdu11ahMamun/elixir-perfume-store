package com.elixir.service.delivery.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.delivery.dto.DeliveryAreaCreateRequest;
import com.elixir.service.delivery.dto.DeliveryAreaResponse;
import com.elixir.service.delivery.dto.DeliveryAreaUpdateRequest;
import com.elixir.service.delivery.dto.DeliveryChargeResponse;
import com.elixir.service.delivery.entity.DeliveryArea;
import com.elixir.service.delivery.repository.DeliveryAreaRepository;
import com.elixir.service.delivery.service.DeliveryAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DeliveryAreaServiceImpl implements DeliveryAreaService {

    private final DeliveryAreaRepository deliveryAreaRepository;

    @Override
    @Transactional(readOnly = true)
    public DeliveryAreaResponse getById(Long id) {
        return toResponse(findAreaById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryAreaResponse> getAll() {
        return deliveryAreaRepository.findAll()
                .stream()
                .filter(area -> area.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public DeliveryAreaResponse create(DeliveryAreaCreateRequest request) {
        String district = request.getDistrict().trim();
        String upazila = normalizeUpazila(request.getUpazila());

        if (existsActiveCombo(district, upazila)) {
            throw new DuplicateResourceException(
                    upazila == null
                            ? "A district-wide delivery area for " + district + " already exists"
                            : "A delivery area for " + district + " / " + upazila + " already exists");
        }

        DeliveryArea area = new DeliveryArea();
        area.setDistrict(district);
        area.setUpazila(upazila);
        area.setCharge(request.getCharge());
        area.setActive(request.getActive() == null || request.getActive());

        DeliveryArea saved = deliveryAreaRepository.save(area);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public DeliveryAreaResponse update(Long id, DeliveryAreaUpdateRequest request) {
        DeliveryArea existing = findAreaById(id);

        String newDistrict = request.getDistrict() != null ? request.getDistrict().trim() : existing.getDistrict();
        // null = "don't touch"; blank string = "clear back to district-wide"
        String newUpazila = request.getUpazila() != null ? normalizeUpazila(request.getUpazila()) : existing.getUpazila();

        boolean comboChanged = !newDistrict.equals(existing.getDistrict()) || !Objects.equals(newUpazila, existing.getUpazila());
        if (comboChanged && existsActiveCombo(newDistrict, newUpazila)) {
            throw new DuplicateResourceException(
                    newUpazila == null
                            ? "A district-wide delivery area for " + newDistrict + " already exists"
                            : "A delivery area for " + newDistrict + " / " + newUpazila + " already exists");
        }

        existing.setDistrict(newDistrict);
        existing.setUpazila(newUpazila);

        if (request.getCharge() != null) {
            existing.setCharge(request.getCharge());
        }
        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        DeliveryArea saved = deliveryAreaRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public DeliveryAreaResponse toggleStatus(Long id) {
        DeliveryArea existing = findAreaById(id);
        existing.setActive(!Boolean.TRUE.equals(existing.getActive()));

        DeliveryArea saved = deliveryAreaRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        DeliveryArea existing = findAreaById(id);
        existing.setDeletedAt(LocalDateTime.now());
        deliveryAreaRepository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getActiveDistricts() {
        return deliveryAreaRepository.findByActiveTrueAndDeletedAtIsNull()
                .stream()
                .map(DeliveryArea::getDistrict)
                .distinct()
                .sorted()
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getActiveUpazilas(String district) {
        return deliveryAreaRepository.findByActiveTrueAndDeletedAtIsNull()
                .stream()
                .filter(area -> area.getDistrict().equalsIgnoreCase(district) && area.getUpazila() != null)
                .map(DeliveryArea::getUpazila)
                .distinct()
                .sorted()
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryChargeResponse resolveCharge(String district, String upazila) {
        DeliveryArea area = resolveActiveArea(district, normalizeUpazila(upazila));
        return new DeliveryChargeResponse(area.getDistrict(), area.getUpazila(), area.getCharge());
    }

    /**
     * Resolves the active delivery area for a district/upazila pair — an
     * exact upazila match if one exists, otherwise the district-wide entry.
     * Order placement (OrderServiceImpl) mirrors this same fallback logic
     * against its own DeliveryAreaRepository dependency, consistent with how
     * it already reaches into other domains' repositories directly (e.g.
     * ProductSizeRepository) rather than through their service interfaces.
     */
    private DeliveryArea resolveActiveArea(String district, String upazila) {
        if (district == null || district.isBlank()) {
            throw new BusinessValidationException("District is required");
        }
        String trimmedDistrict = district.trim();
        String normalizedUpazila = normalizeUpazila(upazila);

        if (normalizedUpazila != null) {
            var exact = deliveryAreaRepository.findByDistrictAndUpazilaAndActiveTrueAndDeletedAtIsNull(trimmedDistrict, normalizedUpazila);
            if (exact.isPresent()) {
                return exact.get();
            }
        }

        return deliveryAreaRepository.findByDistrictAndUpazilaIsNullAndActiveTrueAndDeletedAtIsNull(trimmedDistrict)
                .orElseThrow(() -> new BusinessValidationException(
                        "Delivery is not available for the selected location"));
    }

    private boolean existsActiveCombo(String district, String upazila) {
        return upazila == null
                ? deliveryAreaRepository.existsByDistrictAndUpazilaIsNullAndDeletedAtIsNull(district)
                : deliveryAreaRepository.existsByDistrictAndUpazilaAndDeletedAtIsNull(district, upazila);
    }

    private String normalizeUpazila(String upazila) {
        return (upazila == null || upazila.isBlank()) ? null : upazila.trim();
    }

    private DeliveryArea findAreaById(Long id) {
        return deliveryAreaRepository.findById(id)
                .filter(area -> area.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery area not found"));
    }

    private DeliveryAreaResponse toResponse(DeliveryArea area) {
        DeliveryAreaResponse response = new DeliveryAreaResponse();
        response.setId(area.getId());
        response.setDistrict(area.getDistrict());
        response.setUpazila(area.getUpazila());
        response.setCharge(area.getCharge());
        response.setActive(area.getActive());
        response.setCreatedAt(area.getCreatedAt());
        response.setUpdatedAt(area.getUpdatedAt());
        return response;
    }
}
