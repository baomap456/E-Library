import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import type { BorrowingRecord } from '../../types/modules/borrowing';

type Props = {
    open: boolean;
    record: BorrowingRecord | null;
    onClose: () => void;
};

function detailValue(value?: string | number | null) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    return String(value);
}

export default function BorrowRecordDetailDialog({ open, record, onClose }: Readonly<Props>) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Chi tiết phiếu mượn</DialogTitle>
            <DialogContent>
                {!record ? null : (
                    <Box sx={{ display: 'grid', gap: 1.4 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`Phiếu #${record.recordId}`} color="primary" />
                            <Chip label={record.status} />
                            {record.temporaryRecord && <Chip label="Phiếu tạm" color="warning" />}
                        </Box>

                        <Grid container spacing={1.4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Người mượn</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{detailValue(record.userFullName || record.username)}</Typography>
                                <Typography variant="body2" color="text.secondary">Username: {detailValue(record.username)}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Sách</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{detailValue(record.bookTitle)}</Typography>
                                <Typography variant="body2" color="text.secondary">Barcode: {detailValue(record.barcode)}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Ngày mượn</Typography>
                                <Typography>{record.borrowDate ? new Date(record.borrowDate).toLocaleString('vi-VN') : '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Hạn trả</Typography>
                                <Typography>{record.dueDate ? new Date(record.dueDate).toLocaleString('vi-VN') : '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Ngày trả</Typography>
                                <Typography>{record.returnDate ? new Date(record.returnDate).toLocaleString('vi-VN') : '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Hình thức</Typography>
                                <Typography>{record.borrowMode === 'READ_ON_SITE' ? 'Đọc tại chỗ' : 'Mượn mang về'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Tiền cọc</Typography>
                                <Typography>{Number(record.depositAmount || 0).toLocaleString('vi-VN')} VND</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">CCCD</Typography>
                                <Typography>{detailValue(record.borrowerCitizenId)}</Typography>
                            </Grid>
                        </Grid>

                        <Divider />

                        <Grid container spacing={1.4}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Phạt hiện tại</Typography>
                                <Typography sx={{ fontWeight: 700, color: 'error.main' }}>
                                    {Number(record.fineAmount || 0).toLocaleString('vi-VN')} VND
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Sự cố</Typography>
                                <Typography>{detailValue(record.incidentType)}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Bồi thường</Typography>
                                <Typography>{Number(record.compensationAmount || 0).toLocaleString('vi-VN')} VND</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" color="text.secondary">Ghi chú sự cố</Typography>
                                <Typography>{detailValue(record.incidentNote)}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}