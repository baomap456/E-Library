import axiosClient from '../axiosClient';
import type {
    ReportsDiscrepancy,
    ReportsExportResponse,
    ReportsFinancial,
    ReportsTrend,
} from '../../types/modules/reports';

export async function fetchReportsData(period: string): Promise<{
    discrepancies: ReportsDiscrepancy[];
    trends: ReportsTrend[];
    financial: ReportsFinancial;
}> {
    const [discrepancies, trends, financial] = await Promise.all([
        axiosClient.get<unknown, ReportsDiscrepancy[]>('/reports/inventory/discrepancies'),
        axiosClient.get<unknown, ReportsTrend[]>('/reports/trends'),
        axiosClient.get<unknown, ReportsFinancial>('/reports/financial', { params: { period } }),
    ]);

    return { discrepancies, trends, financial };
}

export function createInventorySession(name: string, area: string) {
    return axiosClient.post('/reports/inventory/sessions', { name, area });
}

export function exportReport(format: 'excel' | 'pdf') {
    return axiosClient.post<unknown, ReportsExportResponse>('/reports/export', { format });
}
