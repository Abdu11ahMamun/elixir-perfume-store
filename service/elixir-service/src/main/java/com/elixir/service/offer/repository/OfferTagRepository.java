package com.elixir.service.offer.repository;

import com.elixir.service.offer.entity.OfferTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfferTagRepository extends JpaRepository<OfferTag, Long> {

	boolean existsBySlug(String slug);

	Optional<OfferTag> findBySlug(String slug);

	List<OfferTag> findByActiveTrue();
}
