package com.example.demo.dto.catalog;

import jakarta.validation.constraints.Size;

public record CatalogReserveRequest(
        @Size(max = 50, message = "username tối đa 50 ký tự")
        String username) {
}
