import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { CatalogBookDetailResponse, CatalogBookItem } from '../../types/modules/catalog';

type Props = Readonly<{
    selectedBook: CatalogBookItem | null;
    detail: CatalogBookDetailResponse | null;
    onReserve: () => Promise<void>;
    onJoinWaitlist: (bookId: number) => Promise<void>;
    canReserve: boolean;
    reserveDisabledMessage?: string;
    canJoinWaitlist: boolean;
    waitlistDisabledMessage?: string;
}>;

export default function CatalogBookDetailCard({ selectedBook, detail, onReserve, onJoinWaitlist, canReserve, reserveDisabledMessage, canJoinWaitlist, waitlistDisabledMessage }: Props) {
    const remainingCopies = selectedBook?.availableItems ?? 0;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Chi tiết sách
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{selectedBook?.title || 'Không có dữ liệu'}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {detail?.description || 'Ảnh bìa, mô tả nội dung, trạng thái và vị trí kệ.'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Vị trí: {detail?.location || 'N/A'}
                </Typography>
                {selectedBook && (
                    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', mb: 1 }}>
                        <Chip label={`Còn lại: ${remainingCopies} cuốn`} color={remainingCopies > 0 ? 'success' : 'default'} />
                        <Chip label={`Đang chờ: ${selectedBook.pendingRequests} yêu cầu`} variant="outlined" />
                    </Stack>
                )}
                {selectedBook && (
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Số lượng còn lại hiển thị rõ theo từng cuốn để bạn biết ngay có thể lập phiếu mượn hay phải chờ.
                    </Typography>
                )}
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => void onReserve()}
                    disabled={!selectedBook || remainingCopies <= 0 || !canReserve}
                    sx={{ mb: 1 }}
                >
                    {canReserve ? 'Lập phiếu mượn sách' : reserveDisabledMessage || 'Thủ thư không thể mượn cho chính mình'}
                </Button>
                {selectedBook && selectedBook.availableItems <= 0 && (
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => void onJoinWaitlist(selectedBook.id)}
                        disabled={!canJoinWaitlist}
                    >
                        {canJoinWaitlist ? 'Đặt trước' : waitlistDisabledMessage || 'Thủ thư không vào hàng đợi'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
