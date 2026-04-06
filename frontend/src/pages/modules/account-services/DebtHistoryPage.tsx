import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BorrowingFinesCard from '../../../components/borrowing/BorrowingFinesCard';
import { useAuthPersonal } from '../../../hooks/modules/useAuthPersonal';
import { fetchFinePaymentQr } from '../../../api/modules/borrowingApi';
import type { BorrowingFinesResponse } from '../../../types/modules/borrowing';

type FinePaymentQrState = {
    qrPayload: string;
    amount: number;
    paymentReference: string;
    paymentMethod: string;
};

type FineHistoryItem = NonNullable<BorrowingFinesResponse['paidHistory']>[number];

export default function DebtHistoryPage() {
    const navigate = useNavigate();
    const { fines, loading, error } = useAuthPersonal();
    const [openQrDialog, setOpenQrDialog] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<FineHistoryItem | null>(null);
    const [qrData, setQrData] = useState<FinePaymentQrState | null>(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [qrError, setQrError] = useState('');

    const openPaymentQr = async () => {
        setQrLoading(true);
        setQrError('');
        try {
            const response = await fetchFinePaymentQr();
            setQrData(response);
            setOpenQrDialog(true);
        } catch {
            setQrError('Không thể tạo mã QR thanh toán lúc này.');
            setOpenQrDialog(true);
        } finally {
            setQrLoading(false);
        }
    };

    const paymentQrUrl = qrData
        ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData.qrPayload)}`
        : '';

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ mb: 2.2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Lịch sử nợ phí</Typography>
                    <Typography color="text.secondary">Xem lịch sử thanh toán và tổng dư nợ hiện tại.</Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/app/profile')}>Về tài khoản của tôi</Button>
            </Stack>
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            {qrError && <Alert severity="error" sx={{ mb: 2 }}>{qrError}</Alert>}
            <BorrowingFinesCard
                fines={fines}
                onPayOnline={() => void openPaymentQr()}
                onViewDetail={setSelectedHistoryItem}
            />

            <Dialog open={selectedHistoryItem !== null} onClose={() => setSelectedHistoryItem(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết giao dịch nợ phí</DialogTitle>
                <DialogContent>
                    {selectedHistoryItem && (
                        <Box sx={{ display: 'grid', gap: 1 }}>
                            <Typography><strong>ID giao dịch:</strong> {selectedHistoryItem.paymentId}</Typography>
                            <Typography><strong>Mã phiếu mượn:</strong> {selectedHistoryItem.recordId ?? '-'}</Typography>
                            <Typography><strong>Ngày thanh toán:</strong> {String(selectedHistoryItem.paidAt || '').slice(0, 10)}</Typography>
                            <Typography><strong>Số tiền:</strong> {(selectedHistoryItem.amount || 0).toLocaleString('vi-VN')} VND</Typography>
                            <Typography><strong>Phương thức:</strong> {selectedHistoryItem.paymentMethod || '-'}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedHistoryItem(null)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openQrDialog} onClose={() => setOpenQrDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Thanh toán online</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Quét mã QR bên dưới để thanh toán số nợ hiện tại.
                    </Typography>
                    {qrLoading && (
                        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!qrLoading && qrData && (
                        <>
                            <Box sx={{ display: 'grid', placeItems: 'center' }}>
                                <Box
                                    component="img"
                                    src={paymentQrUrl}
                                    alt="QR thanh toán nợ phí"
                                    sx={{ width: 220, height: 220, borderRadius: 2, border: '1px solid #d4ddf2' }}
                                />
                            </Box>
                            <Typography sx={{ mt: 2, fontWeight: 700 }}>
                                Số tiền: {qrData.amount.toLocaleString('vi-VN')} VND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Mã giao dịch: {qrData.paymentReference}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQrDialog(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
