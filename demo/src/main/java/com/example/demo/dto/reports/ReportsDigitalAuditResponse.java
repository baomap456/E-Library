package com.example.demo.dto.reports;

import java.util.List;

public record ReportsDigitalAuditResponse(
        int checkedCount,
        int brokenCount,
        List<ReportsDigitalAuditItemResponse> items) {
}
