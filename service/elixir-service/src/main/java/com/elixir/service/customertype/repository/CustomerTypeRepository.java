package com.elixir.service.customertype.repository;

import com.elixir.service.customertype.entity.CustomerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerTypeRepository extends JpaRepository<CustomerType, Long> {

    boolean existsByNameAndDeletedAtIsNull(String name);

    List<CustomerType> findByActiveTrueAndDeletedAtIsNullOrderByDisplayOrderAsc();
}
