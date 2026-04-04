import axiosClient from '../axiosClient';
import type {
    ReportsAuditLog,
    ReportsDigitalAuditResponse,
    ReportsDiscardBooksResponse,
    ReportsDiscrepancy,
    ReportsExportResponse,
    ReportsFinancial,
    ReportsKpi,
    ReportsPhysicalAuditResponse,
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
    return axiosClient.post('/reports/inventory/sessions', { name, area });
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

export function discardBooks(bookIds: number[], reason: string) {
    return axiosClient.post<unknown, ReportsDiscardBooksResponse>('/reports/inventory/discard', {
        bookIds,
        reason,
    });
}

export function exportReport(format: 'excel' | 'pdf') {
    return axiosClient.post<unknown, ReportsExportResponse>('/reports/export', { format });
}
