import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BorrowingRequestsCard from '../../../components/borrowing/BorrowingRequestsCard';
import { useAuthPersonal } from '../../../hooks/modules/useAuthPersonal';
import type { BorrowRequestResponse } from '../../../types/borrowing';

export default function MyRequestsPage() {
    const navigate = useNavigate();
    const { myRequests, loading, error } = useAuthPersonal();
    const [selectedRequest, setSelectedRequest] = useState<BorrowRequestResponse | null>(null);

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
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Phiếu của tôi</Typography>
                    <Typography color="text.secondary">Xem danh sách phiếu mượn và phiếu gia hạn đã gửi.</Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/app/profile')}>Về tài khoản của tôi</Button>
            </Stack>
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            <BorrowingRequestsCard myRequests={myRequests} onViewDetail={setSelectedRequest} />

            <Dialog open={selectedRequest !== null} onClose={() => setSelectedRequest(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết phiếu</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ display: 'grid', gap: 1 }}>
                            <Typography><strong>ID:</strong> {selectedRequest.id}</Typography>
                            <Typography><strong>Loại phiếu:</strong> {selectedRequest.requestType === 'RENEWAL' ? 'Gia hạn' : 'Mượn sách'}</Typography>
                            <Typography><strong>Sách:</strong> {selectedRequest.bookTitle || `Sách #${selectedRequest.bookId ?? '-'}`}</Typography>
                            <Typography><strong>Mã phiếu mượn:</strong> {selectedRequest.borrowRecordId ? `#${selectedRequest.borrowRecordId}` : '-'}</Typography>
                            <Typography><strong>Ngày gửi:</strong> {String(selectedRequest.requestDate).slice(0, 10)}</Typography>
                            <Typography><strong>Ngày lấy sách:</strong> {selectedRequest.requestedPickupDate ? String(selectedRequest.requestedPickupDate).slice(0, 10) : '-'}</Typography>
                            <Typography><strong>Ngày trả dự kiến:</strong> {selectedRequest.requestedReturnDate ? String(selectedRequest.requestedReturnDate).slice(0, 10) : '-'}</Typography>
                            <Typography><strong>Trạng thái:</strong> {selectedRequest.status}</Typography>
                            <Typography><strong>Người duyệt:</strong> {selectedRequest.approvedByUsername || '-'}</Typography>
                            <Typography><strong>Ngày duyệt:</strong> {selectedRequest.approvalDate ? String(selectedRequest.approvalDate).slice(0, 10) : '-'}</Typography>
                            <Typography><strong>Ghi chú:</strong> {selectedRequest.approvalNote || '-'}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedRequest(null)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
