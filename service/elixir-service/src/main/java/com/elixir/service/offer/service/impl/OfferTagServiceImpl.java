package com.elixir.service.offer.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
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
    public OfferTag getById(Long id) {
        return offerTagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public OfferTag getBySlug(String slug) {
        return offerTagRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferTag> getAll() {
        return offerTagRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferTag> getActive() {
        return offerTagRepository.findByActiveTrue();
    }

    @Override
    @Transactional
    public OfferTag create(OfferTag offerTag) {
        if (offerTagRepository.existsBySlug(offerTag.getSlug())) {
            throw new DuplicateResourceException("Offer tag slug already exists");
        }

        return offerTagRepository.save(offerTag);
    }

    @Override
    @Transactional
    public OfferTag update(Long id, OfferTag offerTag) {
        OfferTag existing = getById(id);

        existing.setName(offerTag.getName());
        existing.setSlug(offerTag.getSlug());
        existing.setColorCode(offerTag.getColorCode());
        existing.setActive(offerTag.getActive());

        return offerTagRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OfferTag existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        offerTagRepository.save(existing);
    }
}