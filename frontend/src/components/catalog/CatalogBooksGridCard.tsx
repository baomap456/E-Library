import { Box, Button, Card, CardContent, Chip, Grid, Pagination, Stack, Typography } from '@mui/material';
import type { CatalogBookItem } from '../../types/modules/catalog';

type Props = Readonly<{
    books: CatalogBookItem[];
    pagedBooks: CatalogBookItem[];
    booksPerPage: number;
    bookPage: number;
    totalBookPages: number;
    selectedBookId?: number;
    onChangePage: (page: number) => void;
    onSelectBook: (bookId: number) => void;
    onReserve: (bookId: number) => Promise<void>;
    onJoinWaitlist: (bookId: number) => Promise<void>;
    canReserve: boolean;
    canJoinWaitlist: boolean;
}>;

export default function CatalogBooksGridCard({
    books,
    pagedBooks,
    booksPerPage,
    bookPage,
    totalBookPages,
    selectedBookId,
    onChangePage,
    onSelectBook,
    onReserve,
    onJoinWaitlist,
    canReserve,
    canJoinWaitlist,
}: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Sơ đồ vị trí sách
                </Typography>
                <Grid container spacing={1}>
                    {pagedBooks.map((book) => {
                        const remainingCopies = book.availableItems;
                        const stockLabel = remainingCopies > 0 ? `Còn lại: ${remainingCopies} cuốn` : 'Đã hết sách';

                        return (
                            <Grid key={book.id} size={{ xs: 12, sm: 4 }}>
                                <Box
                                    onClick={() => onSelectBook(book.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            onSelectBook(book.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: selectedBookId === book.id ? '2px solid #2a7be3' : '1px solid #d6deef',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        transition: 'transform 160ms ease, box-shadow 160ms ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 18px 30px rgba(16,67,159,0.10)',
                                        },
                                        '&:focus-visible': {
                                            outline: '3px solid rgba(42,123,227,0.30)',
                                            outlineOffset: 2,
                                        },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700 }}>{book.title}</Typography>
                                    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                                        <Chip label={book.digital ? 'Tài nguyên số' : 'Sách in'} size="small" variant="outlined" />
                                        <Chip label={stockLabel} size="small" color={remainingCopies > 0 ? 'success' : 'default'} />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        Số lượng còn lại: {remainingCopies} cuốn
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Đang chờ duyệt: {book.pendingRequests} yêu cầu
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="contained"
                                            color="secondary"
                                            disabled={remainingCopies <= 0 || !canReserve}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                void onReserve(book.id);
                                            }}
                                        >
                                            {canReserve ? 'Lập phiếu mượn sách' : 'Thủ thư không tự mượn'}
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            disabled={remainingCopies > 0 || !canJoinWaitlist}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                void onJoinWaitlist(book.id);
                                            }}
                                        >
                                            {canJoinWaitlist ? 'Đặt trước' : 'Thủ thư không vào hàng đợi'}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
                {books.length > booksPerPage && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            color="primary"
                            page={bookPage}
                            count={totalBookPages}
                            onChange={(_, next) => onChangePage(next)}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
