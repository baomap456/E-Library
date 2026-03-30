package com.example.demo.dto.reports;

import jakarta.validation.constraints.Pattern;

public record ReportsExportRequest(
        @Pattern(regexp = "^(excel|pdf)?$", message = "format chỉ nhận excel hoặc pdf")
        String format) {
}
