package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.catalog.CatalogBookDetailResponse;
import com.example.demo.dto.catalog.CatalogBookSearchResponse;
import com.example.demo.dto.catalog.CatalogHomeResponse;
import com.example.demo.dto.catalog.CatalogLocationMapResponse;
import com.example.demo.dto.catalog.CatalogReserveRequest;
import com.example.demo.dto.catalog.CatalogReserveResponse;
import com.example.demo.dto.catalog.CatalogShelfItemResponse;
import com.example.demo.service.CatalogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class CatalogController {

        private final CatalogService catalogService;

    @GetMapping("/home")
        public ResponseEntity<CatalogHomeResponse> home() {
                return ResponseEntity.ok(catalogService.home());
    }

    @GetMapping("/books")
        public ResponseEntity<List<CatalogBookSearchResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer publishYear,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean digital) {
                return ResponseEntity.ok(catalogService.search(q, author, category, publishYear, status, digital));
    }

    @GetMapping("/books/{bookId}")
        public ResponseEntity<CatalogBookDetailResponse> detail(@PathVariable Long bookId) {
                return ResponseEntity.ok(catalogService.detail(bookId));
    }

    @GetMapping("/books/{bookId}/location-map")
        public ResponseEntity<CatalogLocationMapResponse> locationMap(@PathVariable Long bookId) {
                return ResponseEntity.ok(catalogService.locationMap(bookId));
    }

    @PostMapping("/books/{bookId}/reserve")
        public ResponseEntity<CatalogReserveResponse> reserve(
                        @PathVariable Long bookId,
            @Valid @RequestBody(required = false) CatalogReserveRequest request) {
                return ResponseEntity.ok(catalogService.reserve(bookId, request));
    }

    @GetMapping("/shelves")
        public ResponseEntity<List<CatalogShelfItemResponse>> shelves() {
                return ResponseEntity.ok(catalogService.shelves());
    }
}
