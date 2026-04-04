package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.digital.DigitalDocumentResponse;
import com.example.demo.dto.digital.DigitalReaderConfigResponse;

public interface DigitalLibraryService {
    List<DigitalDocumentResponse> documents(Integer publishYear, String q);

    DigitalReaderConfigResponse readerConfig(Long bookId);
}
