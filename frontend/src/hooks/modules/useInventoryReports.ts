import { useEffect, useState } from 'react';
import {
    createInventorySession,
    discardBooks,
    exportReport,
    fetchReportsData,
    runDigitalAudit,
    runPhysicalAudit,
} from '../../api/modules/reportsApi';
import type {
    ReportsAuditLog,
    ReportsDigitalAuditResponse,
    ReportsDiscrepancy,
    ReportsFinancial,
    ReportsKpi,
    ReportsPhysicalAuditResponse,
    ReportsTrend,
} from '../../types/modules/reports';

export function useInventoryReports() {
    const [sessionName, setSessionName] = useState('Q2-Inventory-2026');
    const [sessionArea, setSessionArea] = useState('Kho trung tâm');
    const [period, setPeriod] = useState('month');
    const [discrepancies, setDiscrepancies] = useState<ReportsDiscrepancy[]>([]);
    const [trends, setTrends] = useState<ReportsTrend[]>([]);
    const [financial, setFinancial] = useState<ReportsFinancial | null>(null);
    const [kpis, setKpis] = useState<ReportsKpi | null>(null);
    const [auditLogs, setAuditLogs] = useState<ReportsAuditLog[]>([]);

    const [auditBarcode, setAuditBarcode] = useState('');
    const [auditObservedState, setAuditObservedState] = useState<'ON_SHELF' | 'MISSING' | 'DAMAGED'>('ON_SHELF');
    const [auditNote, setAuditNote] = useState('');
    const [lastPhysicalAudit, setLastPhysicalAudit] = useState<ReportsPhysicalAuditResponse | null>(null);
    const [lastDigitalAudit, setLastDigitalAudit] = useState<ReportsDigitalAuditResponse | null>(null);

    const [discardBookIdsRaw, setDiscardBookIdsRaw] = useState('');
    const [discardReason, setDiscardReason] = useState('Sách lỗi thời hoặc hỏng không thể sửa');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const loadData = async (nextPeriod: string) => {
        const data = await fetchReportsData(nextPeriod);
        setDiscrepancies(data.discrepancies);
        setTrends(data.trends);
        setFinancial(data.financial);
        setKpis(data.kpis);
        setAuditLogs(data.auditLogs);
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
            setSuccessMessage('Khởi tạo phiên kiểm kê thành công.');
            await loadData(period);
        } catch {
            setError('Không thể khởi tạo phiên kiểm kê.');
        }
    };

    const handleRunPhysicalAudit = async () => {
        try {
            const result = await runPhysicalAudit(auditBarcode, auditObservedState, auditNote);
            setLastPhysicalAudit(result);
            setSuccessMessage(`Kiểm kê vật lý xong: ${result.result}`);
            setError('');
            await loadData(period);
        } catch {
            setError('Không thể chạy kiểm kê vật lý.');
        }
    };

    const handleRunDigitalAudit = async () => {
        try {
            const result = await runDigitalAudit();
            setLastDigitalAudit(result);
            setSuccessMessage(`Kiểm kê số xong: ${result.brokenCount}/${result.checkedCount} link lỗi`);
            setError('');
            await loadData(period);
        } catch {
            setError('Không thể chạy kiểm kê tài liệu số.');
        }
    };

    const handleDiscardBooks = async () => {
        const ids = discardBookIdsRaw
            .split(',')
            .map((part) => Number.parseInt(part.trim(), 10))
            .filter((id) => Number.isFinite(id));

        if (ids.length === 0) {
            setError('Nhập ít nhất 1 bookId để thanh lý (cách nhau bởi dấu phẩy).');
            return;
        }

        try {
            const result = await discardBooks(ids, discardReason);
            setSuccessMessage(`${result.message} (${result.discardedCount} sách)`);
            setError('');
            await loadData(period);
        } catch {
            setError('Không thể thanh lý sách. Hãy kiểm tra sách có đang mượn/đặt trước không.');
        }
    };

    const handleExport = async (format: 'excel' | 'pdf') => {
        try {
            const data = await exportReport(format);
            setSuccessMessage(`Đã tạo file báo cáo: ${data.downloadPath}`);
            setError('');
            await loadData(period);
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
        kpis,
        auditLogs,
        auditBarcode,
        setAuditBarcode,
        auditObservedState,
        setAuditObservedState,
        auditNote,
        setAuditNote,
        lastPhysicalAudit,
        lastDigitalAudit,
        discardBookIdsRaw,
        setDiscardBookIdsRaw,
        discardReason,
        setDiscardReason,
        loading,
        error,
        successMessage,
        handleCreateSession,
        handleRunPhysicalAudit,
        handleRunDigitalAudit,
        handleDiscardBooks,
        handleExport,
    };
}
