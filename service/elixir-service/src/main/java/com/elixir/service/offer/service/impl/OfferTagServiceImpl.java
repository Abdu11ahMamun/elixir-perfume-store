package com.elixir.service.offer.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.offer.dto.OfferTagCreateRequest;
import com.elixir.service.offer.dto.OfferTagResponse;
import com.elixir.service.offer.dto.OfferTagUpdateRequest;
import com.elixir.service.offer.entity.OfferTag;
import com.elixir.service.offer.repository.OfferTagRepository;
import com.elixir.service.offer.service.OfferTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferTagServiceImpl implements OfferTagService {

    private final OfferTagRepository offerTagRepository;

    @Override
    @Transactional(readOnly = true)
    public OfferTagResponse getById(Long id) {
        OfferTag offerTag = offerTagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
        return toResponse(offerTag);
    }

    @Override
    @Transactional(readOnly = true)
    public OfferTagResponse getBySlug(String slug) {
        OfferTag offerTag = offerTagRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
        return toResponse(offerTag);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferTagResponse> getAll() {
        return offerTagRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferTagResponse> getActive() {
        return offerTagRepository.findByActiveTrue().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public OfferTagResponse create(OfferTagCreateRequest request) {
        if (offerTagRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Offer tag slug already exists");
        }

        OfferTag offerTag = new OfferTag();
        offerTag.setName(request.getName());
        offerTag.setSlug(request.getSlug());
        offerTag.setColorCode(request.getColorCode());
        offerTag.setActive(request.getActive());

        OfferTag saved = offerTagRepository.save(offerTag);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public OfferTagResponse update(Long id, OfferTagUpdateRequest request) {
        OfferTag existing = offerTagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));

        existing.setName(request.getName());
        existing.setSlug(request.getSlug());
        existing.setColorCode(request.getColorCode());
        existing.setActive(request.getActive());

        OfferTag saved = offerTagRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OfferTag existing = offerTagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
        existing.setDeletedAt(LocalDateTime.now());
        offerTagRepository.save(existing);
    }

    private OfferTagResponse toResponse(OfferTag offerTag) {
        OfferTagResponse response = new OfferTagResponse();
        response.setId(offerTag.getId());
        response.setName(offerTag.getName());
        response.setSlug(offerTag.getSlug());
        response.setColorCode(offerTag.getColorCode());
        response.setActive(offerTag.getActive());
        response.setCreatedAt(offerTag.getCreatedAt());
        response.setUpdatedAt(offerTag.getUpdatedAt());
        return response;
    }
}