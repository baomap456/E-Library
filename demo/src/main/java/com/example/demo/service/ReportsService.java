package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsExportRequest;
import com.example.demo.dto.reports.ReportsExportResponse;
import com.example.demo.dto.reports.ReportsFinancialResponse;
import com.example.demo.dto.reports.ReportsInventorySessionRequest;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;
import com.example.demo.dto.reports.ReportsReconcileRequest;
import com.example.demo.dto.reports.ReportsReconcileResponse;
import com.example.demo.dto.reports.ReportsTrendResponse;

public interface ReportsService {
    ReportsInventorySessionResponse createInventorySession(ReportsInventorySessionRequest request);

    List<ReportsInventorySessionResponse> inventorySessions();

    ReportsReconcileResponse reconcile(ReportsReconcileRequest request);

    List<ReportsDiscrepancyResponse> discrepancies();

    List<ReportsTrendResponse> trends();

    ReportsFinancialResponse financial(String period);

    ReportsExportResponse export(ReportsExportRequest request);
}
