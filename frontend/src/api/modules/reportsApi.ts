import axiosClient from '../axiosClient';
import type {
    ReportsAuditLog,
    ReportsDigitalAuditResponse,
    ReportsDiscardBooksResponse,
    ReportsDiscardReportDetail,
    ReportsDiscardReportSummary,
    ReportsDiscardSuggestionsResponse,
    ReportsDiscrepancy,
    ReportsExportResponse,
    ReportsFinancial,
    ReportsInventoryBarcodeSearchResult,
    ReportsInventoryCloseResponse,
    ReportsInventoryDetail,
    ReportsInventorySession,
    ReportsKpi,
    ReportsPhysicalAuditResponse,
    ReportsReconcileRequest,
    ReportsReconcileResponse,
    ReportsTrend,
} from '../../types/modules/reports';

export async function fetchReportsData(period: string): Promise<{
    discrepancies: ReportsDiscrepancy[];
    trends: ReportsTrend[];
    financial: ReportsFinancial;
    kpis: ReportsKpi;
    auditLogs: ReportsAuditLog[];
}> {
    const [discrepancies, trends, financial, kpis, auditLogs] = await Promise.all([
        axiosClient.get<unknown, ReportsDiscrepancy[]>('/reports/inventory/discrepancies'),
        axiosClient.get<unknown, ReportsTrend[]>('/reports/trends', { params: { period } }),
        axiosClient.get<unknown, ReportsFinancial>('/reports/financial', { params: { period } }),
        axiosClient.get<unknown, ReportsKpi>('/reports/kpis', { params: { period } }),
        axiosClient.get<unknown, ReportsAuditLog[]>('/reports/audit-logs'),
    ]);

    return { discrepancies, trends, financial, kpis, auditLogs };
}

export function createInventorySession(name: string, area: string) {
    return axiosClient.post<unknown, ReportsInventorySession>('/reports/inventory/sessions', { name, area });
}

export function fetchInventorySessions() {
    return axiosClient.get<unknown, ReportsInventorySession[]>('/reports/inventory/sessions');
}

export function fetchInventorySessionDetails(sessionId: number) {
    return axiosClient.get<unknown, ReportsInventoryDetail[]>(`/reports/inventory/sessions/${sessionId}/details`);
}

export function searchInventoryBarcodes(keyword: string) {
    return axiosClient.get<unknown, ReportsInventoryBarcodeSearchResult[]>('/reports/inventory/barcodes/search', {
        params: { keyword },
    });
}

export function reconcileInventoryManual(payload: ReportsReconcileRequest) {
    return axiosClient.post<unknown, ReportsReconcileResponse>('/reports/inventory/reconcile', payload);
}

export function closeInventorySession(sessionId: number) {
    return axiosClient.post<unknown, ReportsInventoryCloseResponse>(`/reports/inventory/sessions/${sessionId}/close`);
}

export function runPhysicalAudit(barcode: string, observedState: 'ON_SHELF' | 'MISSING' | 'DAMAGED', note: string) {
    return axiosClient.post<unknown, ReportsPhysicalAuditResponse>('/reports/inventory/physical-audit', {
        barcode,
        observedState,
        note,
    });
}

export function runDigitalAudit() {
    return axiosClient.post<unknown, ReportsDigitalAuditResponse>('/reports/inventory/digital-audit');
}

export function discardBooks(barcodes: string[], reason: string) {
    return axiosClient.post<unknown, ReportsDiscardBooksResponse>('/reports/inventory/discard', {
        barcodes,
        reason,
    });
}

export function fetchDiscardSuggestions() {
    return axiosClient.get<unknown, ReportsDiscardSuggestionsResponse>('/reports/inventory/discard/suggestions');
}

export function fetchDiscardReports() {
    return axiosClient.get<unknown, ReportsDiscardReportSummary[]>('/reports/inventory/discard/reports');
}

export function fetchDiscardReportDetail(reportId: number) {
    return axiosClient.get<unknown, ReportsDiscardReportDetail>(`/reports/inventory/discard/reports/${reportId}`);
}

export function exportReport(format: 'excel' | 'pdf') {
    return axiosClient.post<unknown, ReportsExportResponse>('/reports/export', { format });
}
