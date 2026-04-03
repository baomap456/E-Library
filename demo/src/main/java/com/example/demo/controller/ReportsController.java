package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.reports.ReportsAuditLogResponse;
import com.example.demo.dto.reports.ReportsDigitalAuditResponse;
import com.example.demo.dto.reports.ReportsDiscardBooksRequest;
import com.example.demo.dto.reports.ReportsDiscardBooksResponse;
import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsExportRequest;
import com.example.demo.dto.reports.ReportsExportResponse;
import com.example.demo.dto.reports.ReportsFinancialResponse;
import com.example.demo.dto.reports.ReportsInventorySessionRequest;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;
import com.example.demo.dto.reports.ReportsKpiResponse;
import com.example.demo.dto.reports.ReportsPhysicalAuditRequest;
import com.example.demo.dto.reports.ReportsPhysicalAuditResponse;
import com.example.demo.dto.reports.ReportsReconcileRequest;
import com.example.demo.dto.reports.ReportsReconcileResponse;
import com.example.demo.dto.reports.ReportsTrendResponse;
import com.example.demo.service.ReportsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ReportsService reportsService;

    @PostMapping("/inventory/sessions")
    public ResponseEntity<ReportsInventorySessionResponse> createInventorySession(@Valid @RequestBody ReportsInventorySessionRequest request) {
        return ResponseEntity.ok(reportsService.createInventorySession(request));
    }

    @GetMapping("/inventory/sessions")
    public ResponseEntity<List<ReportsInventorySessionResponse>> inventorySessions() {
        return ResponseEntity.ok(reportsService.inventorySessions());
    }

    @PostMapping("/inventory/reconcile")
    public ResponseEntity<ReportsReconcileResponse> reconcile(@Valid @RequestBody ReportsReconcileRequest request) {
        return ResponseEntity.ok(reportsService.reconcile(request));
    }

    @GetMapping("/inventory/discrepancies")
    public ResponseEntity<List<ReportsDiscrepancyResponse>> discrepancies() {
        return ResponseEntity.ok(reportsService.discrepancies());
    }

    @GetMapping("/trends")
    public ResponseEntity<List<ReportsTrendResponse>> trends(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(reportsService.trends(period));
    }

    @GetMapping("/financial")
    public ResponseEntity<ReportsFinancialResponse> financial(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(reportsService.financial(period));
    }

    @PostMapping("/export")
    public ResponseEntity<ReportsExportResponse> export(@Valid @RequestBody ReportsExportRequest request) {
        return ResponseEntity.ok(reportsService.export(request));
    }

    @GetMapping("/kpis")
    public ResponseEntity<ReportsKpiResponse> kpis(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(reportsService.kpis(period));
    }

    @PostMapping("/inventory/physical-audit")
    public ResponseEntity<ReportsPhysicalAuditResponse> runPhysicalAudit(@Valid @RequestBody ReportsPhysicalAuditRequest request) {
        return ResponseEntity.ok(reportsService.runPhysicalAudit(request));
    }

    @PostMapping("/inventory/digital-audit")
    public ResponseEntity<ReportsDigitalAuditResponse> runDigitalAudit() {
        return ResponseEntity.ok(reportsService.runDigitalAudit());
    }

    @PostMapping("/inventory/discard")
    public ResponseEntity<ReportsDiscardBooksResponse> discardBooks(@Valid @RequestBody ReportsDiscardBooksRequest request) {
        return ResponseEntity.ok(reportsService.discardBooks(request));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<ReportsAuditLogResponse>> auditLogs() {
        return ResponseEntity.ok(reportsService.auditLogs());
    }
}
