import { Button, Card, CardContent, Typography } from '@mui/material';
import type { CatalogBookDetailResponse, CatalogBookItem } from '../../types/modules/catalog';

type Props = {
    selectedBook: CatalogBookItem | null;
    detail: CatalogBookDetailResponse | null;
    onReserve: () => Promise<void>;
    onJoinWaitlist: (bookId: number) => Promise<void>;
};

export default function CatalogBookDetailCard({ selectedBook, detail, onReserve, onJoinWaitlist }: Props) {
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
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Còn khả dụng: {selectedBook.availableItems} | Đang chờ duyệt: {selectedBook.pendingRequests}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => void onReserve()}
                    disabled={!selectedBook || selectedBook.availableItems <= 0}
                >
                    Lập phiếu mượn sách
                </Button>
                {selectedBook && selectedBook.availableItems <= 0 && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ ml: 1 }}
                        onClick={() => void onJoinWaitlist(selectedBook.id)}
                    >
                        Tham gia hàng chờ
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
