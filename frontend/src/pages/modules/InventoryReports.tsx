import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
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
import { useInventoryReports } from '../../hooks/modules/useInventoryReports';

export default function InventoryReports() {
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
        loading,
        error,
        handleCreateSession,
        handleExport,
    } = useInventoryReports();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>Module 6: Inventory & Reports</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Phiên kiểm kê, đối soát, báo cáo chênh lệch, xu hướng và xuất báo cáo.
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
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
                            <Box
                                sx={{
                                    borderRadius: 2,
                                    border: '1px dashed #c9d7f4',
                                    p: 2,
                                }}
                            >
                                {trends.map((item) => (
                                    <Typography key={item.date}>{String(item.date).slice(0, 10)}: {item.borrowCount} lượt mượn</Typography>
                                ))}
                            </Box>
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
                            <Typography variant="h6" sx={{ mb: 1 }}>Báo cáo tài chính</Typography>
                            <Stack spacing={1.2}>
                                <TextField select label="Chu kỳ" value={period} onChange={(e) => setPeriod(e.target.value)} fullWidth>
                                    <MenuItem value="month">Theo tháng</MenuItem>
                                    <MenuItem value="quarter">Theo quý</MenuItem>
                                    <MenuItem value="year">Theo năm</MenuItem>
                                </TextField>
                                <Typography sx={{ fontWeight: 700 }}>Doanh thu phí phạt: {(financial?.paidFineRevenue || 0).toLocaleString('vi-VN')} VND</Typography>
                                <Typography sx={{ fontWeight: 700 }}>Nợ phí tồn: {(financial?.outstandingDebt || 0).toLocaleString('vi-VN')} VND</Typography>
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
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
