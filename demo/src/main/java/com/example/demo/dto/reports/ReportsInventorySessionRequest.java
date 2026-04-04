package com.example.demo.dto.reports;

import jakarta.validation.constraints.Size;

public record ReportsInventorySessionRequest(
        @Size(max = 255, message = "name tối đa 255 ký tự")
        String name,
        @Size(max = 255, message = "area tối đa 255 ký tự")
        String area) {
}
