package com.elixir.service.offer.service;

import com.elixir.service.offer.entity.OfferTag;

import java.util.List;

public interface OfferTagService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    OfferTag getById(Long id);

    OfferTag getBySlug(String slug);

    List<OfferTag> getAll();

    List<OfferTag> getActive();

    OfferTag create(OfferTag offerTag);

    OfferTag update(Long id, OfferTag offerTag);

    void delete(Long id);
}