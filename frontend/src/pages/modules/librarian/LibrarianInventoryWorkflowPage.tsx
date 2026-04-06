import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
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
import {
    closeInventorySession,
    createInventorySession,
    fetchInventorySessionDetails,
    fetchInventorySessions,
    reconcileInventoryManual,
    searchInventoryBarcodes,
} from '../../../api/modules/reportsApi';
import type {
    ReportsInventoryBarcodeSearchResult,
    ReportsInventoryCloseResponse,
    ReportsInventoryDetail,
    ReportsInventorySession,
} from '../../../types/modules/reports';

export default function LibrarianInventoryWorkflowPage() {
    const [sessionName, setSessionName] = useState('Kiểm kê tháng');
    const [sessionArea, setSessionArea] = useState('Khu IT - Tầng 2');
    const [sessions, setSessions] = useState<ReportsInventorySession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

    const [barcodeKeyword, setBarcodeKeyword] = useState('');
    const [barcodeResults, setBarcodeResults] = useState<ReportsInventoryBarcodeSearchResult[]>([]);
    const [selectedBarcode, setSelectedBarcode] = useState<ReportsInventoryBarcodeSearchResult | null>(null);
    const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);

    const [closeSummary, setCloseSummary] = useState<ReportsInventoryCloseResponse | null>(null);
    const [historyDetailsOpen, setHistoryDetailsOpen] = useState(false);
    const [historyDetailsLoading, setHistoryDetailsLoading] = useState(false);
    const [historySessionTitle, setHistorySessionTitle] = useState('');
    const [historyDetails, setHistoryDetails] = useState<ReportsInventoryDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const selectedSession = useMemo(
        () => sessions.find((session) => session.id === selectedSessionId) ?? null,
        [sessions, selectedSessionId],
    );

    const loadSessions = async () => {
        const data = await fetchInventorySessions();
        setSessions(data);
        const openSession = data.find((session) => session.status === 'OPEN') ?? data[0];
        setSelectedSessionId(openSession?.id ?? null);
    };

    const handleOpenHistoryDetails = async (session: ReportsInventorySession) => {
        setHistoryDetailsLoading(true);
        setError('');
        setHistorySessionTitle(`#${session.id} - ${session.name}`);
        setHistoryDetailsOpen(true);
        try {
            const details = await fetchInventorySessionDetails(session.id);
            setHistoryDetails(details);
        } catch {
            setError('Không tải được chi tiết lịch sử kiểm kê.');
            setHistoryDetails([]);
        } finally {
            setHistoryDetailsLoading(false);
        }
    };

    useEffect(() => {
        void loadSessions();
    }, []);

    const handleCreateSession = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const created = await createInventorySession(sessionName, sessionArea);
            await loadSessions();
            setSelectedSessionId(created.id);
            setScannedBarcodes([]);
            setCloseSummary(null);
            setSuccess('Đã tạo phiên kiểm kê mới.');
        } catch {
            setError('Không tạo được phiên kiểm kê.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchBarcode = async () => {
        if (!barcodeKeyword.trim()) {
            setBarcodeResults([]);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const results = await searchInventoryBarcodes(barcodeKeyword.trim());
            setBarcodeResults(results);
        } catch {
            setError('Không tìm được barcode.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBarcodeToSession = async () => {
        const barcode = (selectedBarcode?.barcode || '').trim();
        if (!selectedSessionId) {
            setError('Bạn cần chọn phiên kiểm kê trước.');
            return;
        }
        if (!barcode) {
            setError('Chọn barcode từ kết quả tìm trước khi ghi nhận.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await reconcileInventoryManual({ sessionId: selectedSessionId, barcode, actualQuantity: 1 });
            setScannedBarcodes((prev) => (prev.includes(barcode) ? prev : [barcode, ...prev]));
            setSelectedBarcode(null);
            setSuccess('Đã ghi nhận barcode vào danh sách sách thực tế trên kệ.');
        } catch {
            setError('Không ghi nhận được barcode vào phiên.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSession = async () => {
        if (!selectedSessionId) {
            setError('Không có phiên để chốt.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const summary = await closeInventorySession(selectedSessionId);
            setCloseSummary(summary);
            await loadSessions();
            setSuccess(summary.message);
        } catch {
            setError('Không thể chốt phiên kiểm kê.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={2.2}>
            <Grid size={{ xs: 12 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Kiểm kê kho</Typography>
                <Typography color="text.secondary">Tạo phiên, tìm barcode, đối soát tự động, xử lý sự cố và chốt phiên.</Typography>
            </Grid>

            {(error || success) && (
                <Grid size={{ xs: 12 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {!error && success && <Alert severity="success">{success}</Alert>}
                </Grid>
            )}

            <Grid size={{ xs: 12, md: 5 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1.2}>
                            <Typography variant="h6">Khởi tạo phiên kiểm kê</Typography>
                            <TextField label="Tên phiên" value={sessionName} onChange={(e) => setSessionName(e.target.value)} fullWidth />
                            <TextField label="Phạm vi khu vực" value={sessionArea} onChange={(e) => setSessionArea(e.target.value)} fullWidth />
                            <Button variant="contained" onClick={() => void handleCreateSession()} disabled={loading}>Khởi tạo phiên</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1.2}>
                            <Typography variant="h6">Phiên đang thao tác</Typography>
                            <Autocomplete
                                options={sessions}
                                value={selectedSession}
                                getOptionLabel={(option) => `#${option.id} - ${option.name} (${option.area}) [${option.status || 'OPEN'}]`}
                                onChange={(_, value) => setSelectedSessionId(value?.id ?? null)}
                                renderInput={(params) => <TextField {...params} label="Chọn phiên" />}
                            />
                            <Typography color="text.secondary">
                                Nếu cần ổn định dữ liệu, có thể tạm dừng mượn/trả tại khu vực đang kiểm kê theo chính sách thư viện.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1.2}>
                            <Typography variant="h6">Tìm kiếm barcode</Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <TextField
                                    label="Tìm barcode"
                                    value={barcodeKeyword}
                                    onChange={(e) => setBarcodeKeyword(e.target.value)}
                                    fullWidth
                                />
                                <Button variant="outlined" onClick={() => void handleSearchBarcode()} disabled={loading}>Tìm</Button>
                            </Stack>

                            <Autocomplete
                                options={barcodeResults}
                                value={selectedBarcode}
                                onChange={(_, value) => setSelectedBarcode(value)}
                                getOptionLabel={(option) => `${option.barcode} - ${option.title}`}
                                renderInput={(params) => <TextField {...params} label="Chọn từ kết quả tìm" />}
                            />

                            <Button variant="contained" onClick={() => void handleAddBarcodeToSession()} disabled={loading || !selectedSessionId}>
                                Ghi nhận vào danh sách thực tế trên kệ
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography variant="h6">Danh sách đã ghi nhận</Typography>
                            <Typography color="text.secondary">Số barcode đã nhập: {scannedBarcodes.length}</Typography>
                            <Divider />
                            <Box sx={{ maxHeight: 260, overflowY: 'auto' }}>
                                <List dense>
                                    {scannedBarcodes.length === 0 && <ListItem><ListItemText primary="Chưa có barcode" /></ListItem>}
                                    {scannedBarcodes.map((barcode) => (
                                        <ListItem key={barcode}>
                                            <ListItemText primary={barcode} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1.2}>
                            <Typography variant="h6">Đối soát, xử lý sự cố và chốt sổ</Typography>
                            <Typography color="text.secondary">
                                Khi bấm "Chốt phiên", hệ thống tự động đối soát MATCHED / MISSING / CONFLICT, chuyển sách thất lạc sang LOST và lưu lịch sử phiên.
                            </Typography>
                            <Button variant="contained" color="warning" onClick={() => void handleCloseSession()} disabled={loading || !selectedSessionId}>
                                Chốt phiên kiểm kê
                            </Button>

                            {closeSummary && (
                                <Card variant="outlined" sx={{ mt: 1 }}>
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography sx={{ fontWeight: 700 }}>Tổng kết đối soát</Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                <Chip color="success" label={`Khớp: ${closeSummary.matchedCount}`} />
                                                <Chip color="error" label={`Thất lạc: ${closeSummary.missingCount}`} />
                                                <Chip color="warning" label={`Lệch logic: ${closeSummary.conflictCount}`} />
                                                <Chip label={`Đã nhập: ${closeSummary.scannedCount}`} />
                                            </Stack>

                                            {closeSummary.missingBarcodes.length > 0 && (
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Danh sách thất lạc</Typography>
                                                    <Typography variant="body2">{closeSummary.missingBarcodes.join(', ')}</Typography>
                                                </Box>
                                            )}

                                            {closeSummary.conflicts.length > 0 && (
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Danh sách conflict</Typography>
                                                    <List dense>
                                                        {closeSummary.conflicts.map((item) => (
                                                            <ListItem key={`${item.type}-${item.barcode}`}>
                                                                <ListItemText
                                                                    primary={`${item.barcode} - ${item.type}`}
                                                                    secondary={item.message}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1.2}>
                            <Typography variant="h6">Lịch sử kiểm kê</Typography>
                            <Typography color="text.secondary">Hiển thị toàn bộ phiên kiểm kê đã tạo trong hệ thống.</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Tên phiên</TableCell>
                                        <TableCell>Khu vực</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Thời gian tạo</TableCell>
                                        <TableCell align="right">Chi tiết</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sessions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">Chưa có dữ liệu lịch sử kiểm kê</TableCell>
                                        </TableRow>
                                    ) : (
                                        sessions.map((session) => (
                                            <TableRow key={session.id}>
                                                <TableCell>{session.id}</TableCell>
                                                <TableCell>{session.name}</TableCell>
                                                <TableCell>{session.area}</TableCell>
                                                <TableCell>{session.status || 'OPEN'}</TableCell>
                                                <TableCell>{new Date(session.createdAt).toLocaleString('vi-VN')}</TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" onClick={() => void handleOpenHistoryDetails(session)}>
                                                        Xem chi tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Dialog open={historyDetailsOpen} onClose={() => setHistoryDetailsOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Chi tiết lịch sử kiểm kê {historySessionTitle ? `- ${historySessionTitle}` : ''}</DialogTitle>
                <DialogContent>
                    {historyDetailsLoading ? (
                        <Typography>Đang tải dữ liệu...</Typography>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Barcode</TableCell>
                                    <TableCell>Tên sách</TableCell>
                                    <TableCell>Trạng thái hiện tại</TableCell>
                                    <TableCell>Vị trí</TableCell>
                                    <TableCell>Thời gian ghi nhận</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyDetails.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Phiên này chưa có dữ liệu ghi nhận barcode</TableCell>
                                    </TableRow>
                                ) : (
                                    historyDetails.map((row) => (
                                        <TableRow key={`${row.barcode}-${row.scannedAt}`}>
                                            <TableCell>{row.barcode}</TableCell>
                                            <TableCell>{row.title}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{row.locationLabel}</TableCell>
                                            <TableCell>{new Date(row.scannedAt).toLocaleString('vi-VN')}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
            </Dialog>
        </Grid>
    );
}
