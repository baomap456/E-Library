package com.example.demo.dto.digital;

import java.util.List;

public record DigitalReaderConfigResponse(
        Long bookId,
        String title,
        Boolean fullscreenEnabled,
        Boolean allowDownload,
        Boolean allowRightClick,
        List<String> toolbar) {
}
