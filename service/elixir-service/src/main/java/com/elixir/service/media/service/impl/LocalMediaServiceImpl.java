package com.elixir.service.media.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.config.UploadProperties;
import com.elixir.service.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalMediaServiceImpl implements MediaService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final UploadProperties uploadProperties;

    @Override
    public String uploadImage(MultipartFile file) {
        validateFile(file);

        String extension = ALLOWED_CONTENT_TYPES.get(file.getContentType());
        String filename = UUID.randomUUID() + extension;

        Path productUploadDir = Path.of(uploadProperties.getBaseDir(), "products")
                .toAbsolutePath()
                .normalize();

        Path targetPath = productUploadDir.resolve(filename).normalize();

        try {
            Files.createDirectories(productUploadDir);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath);
            }
        } catch (IOException exception) {
            throw new BusinessValidationException("Unable to upload image");
        }

        return uploadProperties.getPublicPath() + "/products/" + filename;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessValidationException("Image file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessValidationException("Image size must not exceed 5MB");
        }

        if (!ALLOWED_CONTENT_TYPES.containsKey(file.getContentType())) {
            throw new BusinessValidationException("Only JPG, PNG, and WEBP images are allowed");
        }
    }
}