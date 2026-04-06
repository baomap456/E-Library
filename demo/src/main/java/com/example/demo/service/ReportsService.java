package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.reports.ReportsAuditLogResponse;
import com.example.demo.dto.reports.ReportsInventoryBarcodeSearchResponse;
import com.example.demo.dto.reports.ReportsInventoryCloseResponse;
import com.example.demo.dto.reports.ReportsDigitalAuditResponse;
import com.example.demo.dto.reports.ReportsDiscardBooksRequest;
import com.example.demo.dto.reports.ReportsDiscardBooksResponse;
import com.example.demo.dto.reports.ReportsDiscardReportDetailResponse;
import com.example.demo.dto.reports.ReportsDiscardReportSummaryResponse;
import com.example.demo.dto.reports.ReportsDiscardSuggestionsResponse;
import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsExportRequest;
import com.example.demo.dto.reports.ReportsExportResponse;
import com.example.demo.dto.reports.ReportsFinancialResponse;
import com.example.demo.dto.reports.ReportsInventoryDetailResponse;
import com.example.demo.dto.reports.ReportsInventorySessionRequest;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;
import com.example.demo.dto.reports.ReportsKpiResponse;
import com.example.demo.dto.reports.ReportsPhysicalAuditRequest;
import com.example.demo.dto.reports.ReportsPhysicalAuditResponse;
import com.example.demo.dto.reports.ReportsReconcileRequest;
import com.example.demo.dto.reports.ReportsReconcileResponse;
import com.example.demo.dto.reports.ReportsTrendResponse;

public interface ReportsService {
    ReportsInventorySessionResponse createInventorySession(ReportsInventorySessionRequest request);

    List<ReportsInventorySessionResponse> inventorySessions();

    List<ReportsInventoryDetailResponse> inventorySessionDetails(Long sessionId);

    ReportsReconcileResponse reconcile(ReportsReconcileRequest request);

    List<ReportsInventoryBarcodeSearchResponse> searchBarcodes(String keyword);

    ReportsInventoryCloseResponse closeInventorySession(Long sessionId);

    List<ReportsDiscrepancyResponse> discrepancies();

    List<ReportsTrendResponse> trends(String period);

    ReportsFinancialResponse financial(String period);

    ReportsExportResponse export(ReportsExportRequest request);

    ReportsKpiResponse kpis(String period);

    ReportsPhysicalAuditResponse runPhysicalAudit(ReportsPhysicalAuditRequest request);

    ReportsDigitalAuditResponse runDigitalAudit();

    ReportsDiscardSuggestionsResponse discardSuggestions();

    List<ReportsDiscardReportSummaryResponse> discardReports();

    ReportsDiscardReportDetailResponse discardReportDetail(Long reportId);

    ReportsDiscardBooksResponse discardBooks(ReportsDiscardBooksRequest request);

    List<ReportsAuditLogResponse> auditLogs();
}
