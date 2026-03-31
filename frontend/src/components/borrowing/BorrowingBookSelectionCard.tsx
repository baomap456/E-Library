import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import type { CatalogBookItem } from '../../types/modules/catalog';

type Props = {
    books: CatalogBookItem[];
    requestedPickupDate: string;
    onRequestedPickupDateChange: (date: string) => void;
    requestedReturnDate: string;
    onRequestedReturnDateChange: (date: string) => void;
    waitlistedBookIds: Set<number>;
    reachedMembershipLimit: boolean;
    membershipLimitMessage: string;
    onCreateRequest: (bookId: number) => Promise<void>;
    onJoinWaitlist: (bookId: number) => Promise<void>;
};

export default function BorrowingBookSelectionCard({
    books,
    requestedPickupDate,
    onRequestedPickupDateChange,
    requestedReturnDate,
    onRequestedReturnDateChange,
    waitlistedBookIds,
    reachedMembershipLimit,
    membershipLimitMessage,
    onCreateRequest,
    onJoinWaitlist,
}: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Chọn sách để lập phiếu mượn / vào hàng chờ</Typography>
                <TextField
                    label="Ngày lấy sách"
                    type="date"
                    value={requestedPickupDate}
                    onChange={(e) => onRequestedPickupDateChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().slice(0, 10) }}
                    sx={{ mb: 1.5, width: { xs: '100%', sm: 260 }, mr: { sm: 1.5 } }}
                />
                <TextField
                    label="Ngày trả dự kiến"
                    type="date"
                    value={requestedReturnDate}
                    onChange={(e) => onRequestedReturnDateChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().slice(0, 10) }}
                    sx={{ mb: 1.5, width: { xs: '100%', sm: 260 } }}
                />
                {reachedMembershipLimit && (
                    <Typography color="error" sx={{ mb: 1.5, fontWeight: 600 }}>
                        {membershipLimitMessage}
                    </Typography>
                )}
                <Grid container spacing={1}>
                    {books.slice(0, 12).map((book) => (
                        <Grid key={book.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ p: 1.5, border: '1px solid #d9e1f1', borderRadius: 2 }}>
                                <Typography sx={{ fontWeight: 700 }}>{book.title}</Typography>
                                <Typography variant="body2" color="text.secondary">Tác giả: {book.author.join(', ')}</Typography>
                                <Typography variant="body2" color="text.secondary">Khả dụng: {book.availableItems}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Đang chờ duyệt: {book.pendingRequests}
                                </Typography>
                                {book.availableItems > 0 ? (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={reachedMembershipLimit}
                                        onClick={() => void onCreateRequest(book.id)}
                                    >
                                        Lập phiếu mượn
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="secondary"
                                        disabled={waitlistedBookIds.has(book.id)}
                                        onClick={() => void onJoinWaitlist(book.id)}
                                    >
                                        {waitlistedBookIds.has(book.id) ? 'Đã trong hàng chờ' : 'Tham gia hàng chờ'}
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}
