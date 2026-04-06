package com.example.demo.dto.reports;

public record ReportsInventoryBarcodeSearchResponse(
        String barcode,
        String title,
        String status,
        String locationLabel) {
}
