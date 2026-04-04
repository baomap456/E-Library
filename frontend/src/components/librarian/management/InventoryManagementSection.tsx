import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useInventoryReports } from '../../../hooks/modules/useInventoryReports';

export default function InventoryManagementSection() {
    const {
        sessionName,
        setSessionName,
        sessionArea,
        setSessionArea,
        period,
        setPeriod,
        discrepancies,
        trends,
        financial,
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
        successMessage,
        handleCreateSession,
        handleRunPhysicalAudit,
        handleRunDigitalAudit,
        handleDiscardBooks,
        handleExport,
    } = useInventoryReports();

    return (
        <Grid container spacing={2.2}>
            {successMessage && <Grid size={{ xs: 12 }}><Alert severity="success">{successMessage}</Alert></Grid>}

            <Grid size={{ xs: 12, md: 5 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>Phiên kiểm kê kho</Typography>
                        <Stack spacing={1.2}>
                            <TextField label="Tên phiên kiểm kê" fullWidth value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
                            <TextField label="Khu vực" fullWidth value={sessionArea} onChange={(e) => setSessionArea(e.target.value)} />
                            <Button variant="contained" onClick={() => void handleCreateSession()}>Khởi tạo đợt kiểm kê</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>Thống kê xu hướng</Typography>
                        <Box sx={{ borderRadius: 2, border: '1px dashed #c9d7f4', p: 2 }}>
                            {trends.map((item) => (
                                <Typography key={String(item.date)}>{String(item.date).slice(0, 10)}: {item.borrowCount} lượt mượn</Typography>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>Kiểm kê vật lý</Typography>
                        <Stack spacing={1.2}>
                            <TextField label="Barcode" value={auditBarcode} onChange={(e) => setAuditBarcode(e.target.value)} />
                            <TextField select label="Trạng thái quan sát" value={auditObservedState} onChange={(e) => setAuditObservedState(e.target.value as 'ON_SHELF' | 'MISSING' | 'DAMAGED')}>
                                <MenuItem value="ON_SHELF">Có trên kệ</MenuItem>
                                <MenuItem value="MISSING">Không tìm thấy</MenuItem>
                                <MenuItem value="DAMAGED">Hư hại</MenuItem>
                            </TextField>
                            <TextField label="Ghi chú" value={auditNote} onChange={(e) => setAuditNote(e.target.value)} />
                            <Button variant="contained" onClick={() => void handleRunPhysicalAudit()}>Chạy kiểm kê vật lý</Button>
                            {lastPhysicalAudit && (
                                <Typography color="text.secondary">Kết quả: {lastPhysicalAudit.result} - {lastPhysicalAudit.message}</Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>Kiểm kê tài liệu số</Typography>
                        <Stack spacing={1.2}>
                            <Button variant="contained" onClick={() => void handleRunDigitalAudit()}>Quét link tài liệu số</Button>
                            <Typography>Đã thu tiền phạt: {(financial?.paidFineRevenue || 0).toLocaleString('vi-VN')} VND</Typography>
                            <Typography>Nợ phí tồn: {(financial?.outstandingDebt || 0).toLocaleString('vi-VN')} VND</Typography>
                            {lastDigitalAudit && (
                                <Typography color="text.secondary">Link lỗi: {lastDigitalAudit.brokenCount}/{lastDigitalAudit.checkedCount}</Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>Báo cáo chênh lệch</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sách</TableCell>
                                    <TableCell align="right">Hệ thống</TableCell>
                                    <TableCell align="right">Thực tế</TableCell>
                                    <TableCell align="right">Chênh lệch</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discrepancies.map((row) => (
                                    <TableRow key={row.title} sx={{ background: row.difference < 0 ? 'rgba(244,67,54,0.08)' : 'transparent' }}>
                                        <TableCell>{row.title}</TableCell>
                                        <TableCell align="right">{row.systemCount}</TableCell>
                                        <TableCell align="right">{row.actualCount}</TableCell>
                                        <TableCell align="right">{row.difference}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>Thanh lý sách (DISCARDED)</Typography>
                        <Stack spacing={1.2}>
                            <TextField label="Book IDs (vd: 1,2,3)" value={discardBookIdsRaw} onChange={(e) => setDiscardBookIdsRaw(e.target.value)} />
                            <TextField label="Lý do thanh lý" value={discardReason} onChange={(e) => setDiscardReason(e.target.value)} />
                            <Button color="error" variant="contained" onClick={() => void handleDiscardBooks()}>Thanh lý</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>Export</Typography>
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" onClick={() => void handleExport('excel')}>Xuất Excel</Button>
                            <Button variant="outlined" onClick={() => void handleExport('pdf')}>Xuất PDF</Button>
                        </Stack>
                        <TextField
                            select
                            label="Chu kỳ"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            fullWidth
                            sx={{ mt: 1.2 }}
                        >
                            <MenuItem value="month">Theo tháng</MenuItem>
                            <MenuItem value="quarter">Theo quý</MenuItem>
                            <MenuItem value="year">Theo năm</MenuItem>
                        </TextField>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>Audit log thao tác quan trọng</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Actor</TableCell>
                                    <TableCell>Action</TableCell>
                                    <TableCell>Target</TableCell>
                                    <TableCell>Chi tiết</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {auditLogs.slice(0, 30).map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{String(log.createdAt).replace('T', ' ').slice(0, 19)}</TableCell>
                                        <TableCell>{log.actor}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.targetType} #{log.targetId}</TableCell>
                                        <TableCell>{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
