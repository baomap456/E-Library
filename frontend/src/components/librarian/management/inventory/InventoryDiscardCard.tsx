import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import LibrarianTablePagination from '../../LibrarianTablePagination';
import type {
    ReportsDiscardBooksResponse,
    ReportsDiscardReportDetail,
    ReportsDiscardReportSummary,
    ReportsDiscardSuggestion,
    ReportsDiscardSuggestionsResponse,
} from '../../../../types/modules/reports';

type Props = {
    discardBarcodesRaw: string;
    discardReason: string;
    discardSuggestions: ReportsDiscardSuggestion[];
    discardSuggestionSummary: ReportsDiscardSuggestionsResponse | null;
    lastDiscardReport: ReportsDiscardBooksResponse | null;
    discardReportHistory: ReportsDiscardReportSummary[];
    selectedDiscardReportDetail: ReportsDiscardReportDetail | null;
    onDiscardBarcodesRawChange: (value: string) => void;
    onDiscardReasonChange: (value: string) => void;
    onUseSuggestedBarcodes: () => void;
    onOpenDiscardReportDetail: (reportId: number) => void;
    onCloseDiscardReportDetail: () => void;
    onDiscardBooks: () => void;
};

export default function InventoryDiscardCard({
    discardBarcodesRaw,
    discardReason,
    discardSuggestions,
    discardSuggestionSummary,
    lastDiscardReport,
    discardReportHistory,
    selectedDiscardReportDetail,
    onDiscardBarcodesRawChange,
    onDiscardReasonChange,
    onUseSuggestedBarcodes,
    onOpenDiscardReportDetail,
    onCloseDiscardReportDetail,
    onDiscardBooks,
}: Readonly<Props>) {
    const [historyPage, setHistoryPage] = useState(0);
    const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
    const [detailPage, setDetailPage] = useState(0);
    const [detailRowsPerPage, setDetailRowsPerPage] = useState(10);

    const pagedDiscardHistory = useMemo(() => {
        const start = historyPage * historyRowsPerPage;
        return discardReportHistory.slice(start, start + historyRowsPerPage);
    }, [discardReportHistory, historyPage, historyRowsPerPage]);

    const pagedDiscardDetailItems = useMemo(() => {
        if (!selectedDiscardReportDetail) {
            return [];
        }
        const start = detailPage * detailRowsPerPage;
        return selectedDiscardReportDetail.items.slice(start, start + detailRowsPerPage);
    }, [selectedDiscardReportDetail, detailPage, detailRowsPerPage]);

    const handleHistoryPageChange = (_: unknown, nextPage: number) => {
        setHistoryPage(nextPage);
    };

    const handleHistoryRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setHistoryRowsPerPage(Number.parseInt(event.target.value, 10));
        setHistoryPage(0);
    };

    const handleDetailPageChange = (_: unknown, nextPage: number) => {
        setDetailPage(nextPage);
    };

    const handleDetailRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDetailRowsPerPage(Number.parseInt(event.target.value, 10));
        setDetailPage(0);
    };

    useEffect(() => {
        setDetailPage(0);
    }, [selectedDiscardReportDetail?.reportId]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Thanh lý mềm + Biên bản</Typography>
                <Stack spacing={1.4}>
                    <Box>
                        <Typography sx={{ fontWeight: 600, mb: 0.6 }}>Gợi ý thanh lý thông minh</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.8 }}>
                            <Chip label={`Tổng gợi ý: ${discardSuggestionSummary?.totalSuggestions ?? 0}`} size="small" />
                            <Chip label={`DAMAGED: ${discardSuggestionSummary?.damagedSuggestions ?? 0}`} size="small" color="warning" />
                            <Chip label={`LOST >365 ngày: ${discardSuggestionSummary?.lostOver365Suggestions ?? 0}`} size="small" color="error" />
                            <Chip label={`Sách ế 5 năm: ${discardSuggestionSummary?.staleNoBorrowSuggestions ?? 0}`} size="small" color="default" />
                        </Stack>
                        <Button size="small" variant="outlined" onClick={onUseSuggestedBarcodes} disabled={discardSuggestions.length === 0}>
                            Dùng toàn bộ barcode gợi ý
                        </Button>
                    </Box>

                    <Box sx={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 1, px: 1 }}>
                        <List dense>
                            {discardSuggestions.length === 0 ? (
                                <ListItem><ListItemText primary="Chưa có barcode nào đạt tiêu chí gợi ý" /></ListItem>
                            ) : (
                                discardSuggestions.map((item) => (
                                    <ListItem key={item.barcode}>
                                        <ListItemText
                                            primary={`${item.barcode} - ${item.title}`}
                                            secondary={`${item.criteriaLabel} | ${item.locationLabel} | borrow=${item.borrowCount}`}
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Box>

                    <TextField
                        label="Danh sách Barcode (vd: BK001-001,BK001-003)"
                        value={discardBarcodesRaw}
                        onChange={(e) => onDiscardBarcodesRawChange(e.target.value)}
                    />
                    <TextField label="Lý do thanh lý" value={discardReason} onChange={(e) => onDiscardReasonChange(e.target.value)} />
                    <Button color="error" variant="contained" onClick={onDiscardBooks}>Thanh lý</Button>

                    {lastDiscardReport && (
                        <Box sx={{ border: '1px solid #fca5a5', borderRadius: 1, p: 1.2, bgcolor: '#fff7f7' }}>
                            <Typography sx={{ fontWeight: 700 }}>Biên bản thanh lý {lastDiscardReport.reportCode}</Typography>
                            <Typography variant="body2">Thời gian: {new Date(lastDiscardReport.reportCreatedAt).toLocaleString('vi-VN')}</Typography>
                            <Typography variant="body2" sx={{ mb: 0.8 }}>Số bản thanh lý: {lastDiscardReport.discardedCount}</Typography>
                            <List dense>
                                {lastDiscardReport.reportItems.map((item) => (
                                    <ListItem key={`${item.barcode}-${item.criteriaCode}`}>
                                        <ListItemText
                                            primary={`${item.barcode} - ${item.title}`}
                                            secondary={`${item.previousStatus} -> ${item.currentStatus} | ${item.criteriaCode}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 0.8 }}>Lịch sử biên bản thanh lý</Typography>
                        <Box sx={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã biên bản</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell align="right">Chi tiết</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {discardReportHistory.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">Chưa có biên bản thanh lý</TableCell>
                                        </TableRow>
                                    ) : (
                                        pagedDiscardHistory.map((report) => (
                                            <TableRow key={report.reportId}>
                                                <TableCell>{report.reportCode}</TableCell>
                                                <TableCell>{new Date(report.createdAt).toLocaleString('vi-VN')}</TableCell>
                                                <TableCell>{report.discardedCount}</TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" onClick={() => onOpenDiscardReportDetail(report.reportId)}>
                                                        Xem lại
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                        <LibrarianTablePagination
                            count={discardReportHistory.length}
                            page={historyPage}
                            rowsPerPage={historyRowsPerPage}
                            onPageChange={handleHistoryPageChange}
                            onRowsPerPageChange={handleHistoryRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 20]}
                        />
                    </Box>
                </Stack>
            </CardContent>

            <Dialog open={Boolean(selectedDiscardReportDetail)} onClose={onCloseDiscardReportDetail} fullWidth maxWidth="md">
                <DialogTitle>
                    {selectedDiscardReportDetail
                        ? `Biên bản ${selectedDiscardReportDetail.reportCode}`
                        : 'Biên bản thanh lý'}
                </DialogTitle>
                <DialogContent>
                    {selectedDiscardReportDetail && (
                        <Stack spacing={1.1}>
                            <Typography variant="body2">Lý do: {selectedDiscardReportDetail.reason}</Typography>
                            <Typography variant="body2">Số bản thanh lý: {selectedDiscardReportDetail.discardedCount}</Typography>
                            <Typography variant="body2">Ngày tạo: {new Date(selectedDiscardReportDetail.createdAt).toLocaleString('vi-VN')}</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Barcode</TableCell>
                                        <TableCell>Tên sách</TableCell>
                                        <TableCell>Trạng thái cũ</TableCell>
                                        <TableCell>Trạng thái mới</TableCell>
                                        <TableCell>Tiêu chí</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagedDiscardDetailItems.map((item) => (
                                        <TableRow key={`${item.barcode}-${item.criteriaCode}`}>
                                            <TableCell>{item.barcode}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.previousStatus}</TableCell>
                                            <TableCell>{item.currentStatus}</TableCell>
                                            <TableCell>{item.criteriaCode}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <LibrarianTablePagination
                                count={selectedDiscardReportDetail.items.length}
                                page={detailPage}
                                rowsPerPage={detailRowsPerPage}
                                onPageChange={handleDetailPageChange}
                                onRowsPerPageChange={handleDetailRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 20]}
                            />
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
