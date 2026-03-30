import { useEffect, useState } from 'react';
import { createInventorySession, exportReport, fetchReportsData } from '../../api/modules/reportsApi';
import type { ReportsDiscrepancy, ReportsFinancial, ReportsTrend } from '../../types/modules/reports';

export function useInventoryReports() {
    const [sessionName, setSessionName] = useState('Q2-Inventory-2026');
    const [sessionArea, setSessionArea] = useState('Kho trung tâm');
    const [period, setPeriod] = useState('month');
    const [discrepancies, setDiscrepancies] = useState<ReportsDiscrepancy[]>([]);
    const [trends, setTrends] = useState<ReportsTrend[]>([]);
    const [financial, setFinancial] = useState<ReportsFinancial | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async (nextPeriod: string) => {
        const data = await fetchReportsData(nextPeriod);
        setDiscrepancies(data.discrepancies);
        setTrends(data.trends);
        setFinancial(data.financial);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadData(period);
            } catch {
                setError('Không tải được dữ liệu báo cáo.');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [period]);

    const handleCreateSession = async () => {
        try {
            await createInventorySession(sessionName, sessionArea);
            setError('');
            alert('Khởi tạo phiên kiểm kê thành công.');
        } catch {
            setError('Không thể khởi tạo phiên kiểm kê.');
        }
    };

    const handleExport = async (format: 'excel' | 'pdf') => {
        try {
            const data = await exportReport(format);
            alert(`Đã tạo file báo cáo: ${data.downloadPath}`);
        } catch {
            setError('Xuất báo cáo thất bại.');
        }
    };

    return {
        sessionName,
        setSessionName,
        sessionArea,
        setSessionArea,
        period,
        setPeriod,
        discrepancies,
        trends,
        financial,
        loading,
        error,
        handleCreateSession,
        handleExport,
    };
}
