package com.elixir.service.delivery.repository;

import com.elixir.service.delivery.entity.DeliveryArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryAreaRepository extends JpaRepository<DeliveryArea, Long> {

    List<DeliveryArea> findByActiveTrueAndDeletedAtIsNull();

    // Uniqueness is scoped to non-deleted records so a district/upazila can
    // be reused after a previous area with the same combination was soft
    // deleted — deliberately not a DB-level UNIQUE KEY (see migration).
    boolean existsByDistrictAndUpazilaIsNullAndDeletedAtIsNull(String district);

    boolean existsByDistrictAndUpazilaAndDeletedAtIsNull(String district, String upazila);

    Optional<DeliveryArea> findByDistrictAndUpazilaAndActiveTrueAndDeletedAtIsNull(String district, String upazila);

    Optional<DeliveryArea> findByDistrictAndUpazilaIsNullAndActiveTrueAndDeletedAtIsNull(String district);
}
