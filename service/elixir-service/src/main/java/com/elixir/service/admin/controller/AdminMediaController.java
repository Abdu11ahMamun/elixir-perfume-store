package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.media.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Admin Media", description = "Admin media upload APIs")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/media")
public class AdminMediaController {

    private final MediaService mediaService;

    @Operation(summary = "Upload image", description = "Uploads a product image to local VPS storage.")
    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        String imageUrl = mediaService.uploadImage(file);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Image uploaded successfully",
                        imageUrl,
                        request.getRequestURI()
                )
        );
    }
}