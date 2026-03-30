import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useBorrowingReservation } from '../../hooks/modules/useBorrowingReservation';

export default function BorrowingReservation() {
    const {
        cart,
        records,
        fines,
        waitBookId,
        setWaitBookId,
        loading,
        error,
        activeRecords,
        handleRenew,
        handleJoinWaitlist,
    } = useBorrowingReservation();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Module 3: Borrowing & Reservation
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Giỏ đặt mượn, theo dõi mượn trả, hàng chờ và lịch sử nợ phí.
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Giỏ sách đặt mượn</Typography>
                            {cart.length === 0 && <Typography>Giỏ đang trống</Typography>}
                            {cart.map((item, index) => (
                                <Typography key={item.bookId}>{index + 1}. {item.title}</Typography>
                            ))}
                            <Button variant="contained" sx={{ mt: 2 }} disabled={cart.length === 0}>Xác nhận đặt chỗ</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Quản lý mượn trả (Cá nhân)</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sách</TableCell>
                                        <TableCell>Hạn trả</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="right">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {records.map((row) => {
                                        const isBorrowing = !row.returnDate;
                                        return (
                                            <TableRow key={row.recordId}>
                                                <TableCell>{row.bookTitle}</TableCell>
                                                <TableCell>{String(row.dueDate || '').slice(0, 10)}</TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={isBorrowing ? 'Đang mượn' : 'Đã trả'} color={isBorrowing ? 'primary' : 'default'} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {isBorrowing ? <Button variant="text" size="small" onClick={() => void handleRenew(row.recordId)}>Gia hạn</Button> : '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>Đăng ký danh sách chờ</Typography>
                            <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                                Nhập Book ID để tham gia hàng đợi khi hết bản cứng.
                            </Typography>
                            <LinearProgress variant="determinate" value={activeRecords.length > 0 ? 72 : 24} sx={{ mb: 1 }} />
                            <TextField
                                fullWidth
                                size="small"
                                label="Book ID"
                                value={waitBookId}
                                onChange={(e) => setWaitBookId(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <Button variant="contained" color="secondary" onClick={handleJoinWaitlist}>Xác nhận tham gia hàng chờ</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Lịch sử nợ phí</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID giao dịch</TableCell>
                                        <TableCell>Ngày thanh toán</TableCell>
                                        <TableCell align="right">Số tiền</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(fines?.paidHistory || []).map((row) => (
                                        <TableRow key={row.paymentId}>
                                            <TableCell>{row.paymentId}</TableCell>
                                            <TableCell>{String(row.paidAt || '').slice(0, 10)}</TableCell>
                                            <TableCell align="right">{(row.amount || 0).toLocaleString('vi-VN')} VND</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Divider sx={{ my: 1.3 }} />
                            <Typography sx={{ fontWeight: 800, mb: 1 }}>
                                Tổng nợ: {(fines?.totalDebt || 0).toLocaleString('vi-VN')} VND
                            </Typography>
                            <Button variant="contained" disabled={(fines?.unpaidCount || 0) === 0}>Thanh toán online</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
