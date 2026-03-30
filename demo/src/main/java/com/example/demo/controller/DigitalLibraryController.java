package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.digital.DigitalDocumentResponse;
import com.example.demo.dto.digital.DigitalReaderConfigResponse;
import com.example.demo.service.DigitalLibraryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/digital")
@RequiredArgsConstructor
public class DigitalLibraryController {

    private final DigitalLibraryService digitalLibraryService;

    @GetMapping("/documents")
    public ResponseEntity<List<DigitalDocumentResponse>> documents(@RequestParam(required = false) Integer publishYear,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(digitalLibraryService.documents(publishYear, q));
    }

    @GetMapping("/documents/{bookId}/reader-config")
    public ResponseEntity<DigitalReaderConfigResponse> readerConfig(@PathVariable Long bookId) {
        return ResponseEntity.ok(digitalLibraryService.readerConfig(bookId));
    }
}
