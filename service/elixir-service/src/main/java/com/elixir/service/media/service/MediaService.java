package com.elixir.service.media.service;

import org.springframework.web.multipart.MultipartFile;

public interface MediaService {

    String uploadImage(MultipartFile file);
}