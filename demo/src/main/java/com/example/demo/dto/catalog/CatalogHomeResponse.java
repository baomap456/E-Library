package com.example.demo.dto.catalog;

import java.util.List;

public record CatalogHomeResponse(
        String searchPlaceholder,
        List<CatalogSimpleBookResponse> newArrivals,
        List<CatalogSimpleBookResponse> mostBorrowed,
        List<String> banners) {
}
