import { useEffect, useState } from 'react';
import {
    createInventorySession,
    discardBooks,
    exportReport,
    fetchDiscardReportDetail,
    fetchDiscardReports,
    fetchDiscardSuggestions,
    fetchReportsData,
    runDigitalAudit,
    runPhysicalAudit,
} from '../../api/modules/reportsApi';
import type {
    ReportsAuditLog,
    ReportsDigitalAuditResponse,
    ReportsDiscardBooksResponse,
    ReportsDiscardReportDetail,
    ReportsDiscardReportSummary,
    ReportsDiscardSuggestion,
    ReportsDiscardSuggestionsResponse,
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

    const [discardBarcodesRaw, setDiscardBarcodesRaw] = useState('');
    const [discardReason, setDiscardReason] = useState('Sách lỗi thời hoặc hỏng không thể sửa');
    const [discardSuggestions, setDiscardSuggestions] = useState<ReportsDiscardSuggestion[]>([]);
    const [discardSuggestionSummary, setDiscardSuggestionSummary] = useState<ReportsDiscardSuggestionsResponse | null>(null);
    const [lastDiscardReport, setLastDiscardReport] = useState<ReportsDiscardBooksResponse | null>(null);
    const [discardReportHistory, setDiscardReportHistory] = useState<ReportsDiscardReportSummary[]>([]);
    const [selectedDiscardReportDetail, setSelectedDiscardReportDetail] = useState<ReportsDiscardReportDetail | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const loadData = async (nextPeriod: string) => {
        try {
            const data = await fetchReportsData(nextPeriod);
            setDiscrepancies(data.discrepancies || []);
            setTrends(data.trends || []);
            setFinancial(data.financial || null);
            setKpis(data.kpis || null);
            setAuditLogs(data.auditLogs || []);
        } catch (err) {
            console.error('Error in loadData:', err);
            throw err;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadData(period);
                const suggestions = await fetchDiscardSuggestions();
                setDiscardSuggestions(suggestions.candidates || []);
                setDiscardSuggestionSummary(suggestions);
                const reports = await fetchDiscardReports();
                setDiscardReportHistory(reports || []);
            } catch (err) {
                console.error('Error loading reports data:', err);
                setError('Không tải được dữ liệu báo cáo.');
                setKpis(null);
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
        const barcodes = discardBarcodesRaw
            .split(',')
            .map((part) => part.trim())
            .filter((barcode) => barcode.length > 0);

        if (barcodes.length === 0) {
            setError('Nhập ít nhất 1 barcode để thanh lý (cách nhau bởi dấu phẩy).');
            return;
        }

        try {
            const result = await discardBooks(barcodes, discardReason);
            setLastDiscardReport(result);
            setSuccessMessage(`${result.message} (${result.discardedCount} bản sách)`);
            setError('');
            await loadData(period);
            const suggestions = await fetchDiscardSuggestions();
            setDiscardSuggestions(suggestions.candidates || []);
            setDiscardSuggestionSummary(suggestions);
            const reports = await fetchDiscardReports();
            setDiscardReportHistory(reports || []);
        } catch {
            setError('Không thể thanh lý sách. Hãy kiểm tra barcode có đang mượn/đặt trước hoặc đã thanh lý.');
        }
    };

    const handleUseSuggestedBarcodes = () => {
        const barcodes = discardSuggestions.map((candidate) => candidate.barcode);
        setDiscardBarcodesRaw(barcodes.join(','));
    };

    const handleOpenDiscardReportDetail = async (reportId: number) => {
        const detail = await fetchDiscardReportDetail(reportId);
        setSelectedDiscardReportDetail(detail);
    };

    const handleCloseDiscardReportDetail = () => {
        setSelectedDiscardReportDetail(null);
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
        discardBarcodesRaw,
        setDiscardBarcodesRaw,
        discardReason,
        setDiscardReason,
        discardSuggestions,
        discardSuggestionSummary,
        lastDiscardReport,
        discardReportHistory,
        selectedDiscardReportDetail,
        loading,
        error,
        successMessage,
        handleCreateSession,
        handleRunPhysicalAudit,
        handleRunDigitalAudit,
        handleDiscardBooks,
        handleUseSuggestedBarcodes,
        handleOpenDiscardReportDetail,
        handleCloseDiscardReportDetail,
        handleExport,
    };
}
