import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useLibrarianPanel } from '../../hooks/modules/useLibrarianPanel';

export default function LibrarianPanel() {
    const {
        dashboard,
        books,
        debtors,
        barcode,
        setBarcode,
        username,
        setUsername,
        incident,
        setIncident,
        loading,
        error,
        handleCheckout,
        handleCheckin,
        handleIncident,
    } = useLibrarianPanel();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>Module 5: Librarian Panel</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Dashboard quản trị, CRUD đầu sách, check-in/check-out, vị trí kệ, yêu cầu gia hạn và sự cố.
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Dashboard quản trị</Typography>
                            <Grid container spacing={1.2}>
                                <Grid size={{ xs: 12, sm: 4 }}><Metric title="Tổng sách" value={String(dashboard?.totalBooks || 0)} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><Metric title="Đang cho mượn" value={String(dashboard?.borrowingNow || 0)} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><Metric title="Lượt mượn hôm nay" value={String(dashboard?.borrowingsToday || 0)} /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Quản lý đầu sách (CRUD)</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Tên sách</TableCell>
                                        <TableCell>Năm</TableCell>
                                        <TableCell>NXB</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {books.slice(0, 8).map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell>{book.id}</TableCell>
                                            <TableCell>{book.title}</TableCell>
                                            <TableCell>{book.publishYear}</TableCell>
                                            <TableCell>{book.publisher}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Check-out / Check-in</Typography>
                            <Stack spacing={1.2}>
                                <TextField label="Username" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
                                <TextField label="Mã sách (barcode)" fullWidth value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                                <Button variant="contained" onClick={() => void handleCheckout()}>Xác nhận giao sách</Button>
                                <Button variant="outlined" onClick={() => void handleCheckin()}>Xác nhận trả sách</Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Quản lý phí phạt</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Reader</TableCell>
                                        <TableCell>Sách</TableCell>
                                        <TableCell align="right">Phí</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {debtors.map((debtor) => (
                                        <TableRow key={debtor.recordId}>
                                            <TableCell>{debtor.username}</TableCell>
                                            <TableCell>{debtor.bookTitle}</TableCell>
                                            <TableCell align="right">{(debtor.fineAmount || 0).toLocaleString('vi-VN')}</TableCell>
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
                            <Typography variant="h6" sx={{ mb: 1.2 }}>Lập biên bản sự cố</Typography>
                            <Stack spacing={1.2}>
                                <TextField
                                    label="Biên bản sự cố"
                                    multiline
                                    minRows={4}
                                    value={incident}
                                    onChange={(e) => setIncident(e.target.value)}
                                />
                                <Button variant="contained" color="secondary" onClick={() => void handleIncident()}>Lập biên bản</Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

function Metric({ title, value }: { title: string; value: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(180deg, #ffffff, #eef4ff)',
                border: '1px solid #dde6fb',
            }}
        >
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
        </Box>
    );
}
