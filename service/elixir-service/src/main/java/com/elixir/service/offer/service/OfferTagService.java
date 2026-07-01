package com.elixir.service.offer.service;

import com.elixir.service.offer.dto.OfferTagCreateRequest;
import com.elixir.service.offer.dto.OfferTagResponse;
import com.elixir.service.offer.dto.OfferTagUpdateRequest;

import java.util.List;

public interface OfferTagService {

    OfferTagResponse getById(Long id);

    OfferTagResponse getBySlug(String slug);

    List<OfferTagResponse> getAll();

    List<OfferTagResponse> getActive();

    OfferTagResponse create(OfferTagCreateRequest request);

    OfferTagResponse update(Long id, OfferTagUpdateRequest request);

    void delete(Long id);
}