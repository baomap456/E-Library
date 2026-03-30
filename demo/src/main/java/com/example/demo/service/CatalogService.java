package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.catalog.CatalogBookDetailResponse;
import com.example.demo.dto.catalog.CatalogBookSearchResponse;
import com.example.demo.dto.catalog.CatalogHomeResponse;
import com.example.demo.dto.catalog.CatalogLocationMapResponse;
import com.example.demo.dto.catalog.CatalogReserveRequest;
import com.example.demo.dto.catalog.CatalogReserveResponse;
import com.example.demo.dto.catalog.CatalogShelfItemResponse;

public interface CatalogService {
    CatalogHomeResponse home();

    List<CatalogBookSearchResponse> search(String q, String author, String category, Integer publishYear, String status,
            Boolean digital);

    CatalogBookDetailResponse detail(Long bookId);

    CatalogLocationMapResponse locationMap(Long bookId);

    CatalogReserveResponse reserve(Long bookId, CatalogReserveRequest request);

    List<CatalogShelfItemResponse> shelves();
}
