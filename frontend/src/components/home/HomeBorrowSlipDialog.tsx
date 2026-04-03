import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import type { CatalogBookItem } from '../../types/modules/catalog';

type Props = {
    open: boolean;
    book: CatalogBookItem | null;
    pickupDate: string;
    returnDate: string;
    submitting: boolean;
    error: string;
    onChangePickupDate: (value: string) => void;
    onChangeReturnDate: (value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
};

export default function HomeBorrowSlipDialog({
    open,
    book,
    pickupDate,
    returnDate,
    submitting,
    error,
    onChangePickupDate,
    onChangeReturnDate,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>Lập phiếu mượn sách</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 0.5 }}>
                    {book && (
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f7f9fe', border: '1px solid #e3e9f5' }}>
                            <Typography sx={{ fontWeight: 800 }}>{book.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ISBN: {book.isbn} | Khả dụng: {book.availableItems} | Đang chờ: {book.pendingRequests}
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        label="Ngày lấy sách"
                        type="date"
                        fullWidth
                        value={pickupDate}
                        onChange={(event) => onChangePickupDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={submitting}
                    />

                    <TextField
                        label="Ngày trả dự kiến"
                        type="date"
                        fullWidth
                        value={returnDate}
                        onChange={(event) => onChangeReturnDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={submitting}
                    />

                    {error && <Alert severity="warning">{error}</Alert>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Hủy</Button>
                <Button variant="contained" onClick={onConfirm} disabled={submitting || !book}>
                    {submitting ? 'Đang gửi phiếu...' : 'Xác nhận phiếu mượn'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
