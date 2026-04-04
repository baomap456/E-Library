package com.example.demo.dto.reports;

import java.time.LocalDateTime;

public record ReportsTrendResponse(
        LocalDateTime date,
        Long borrowCount) {
}
