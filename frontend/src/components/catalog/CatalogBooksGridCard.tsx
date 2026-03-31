import { Box, Button, Card, CardContent, Grid, Pagination, Stack, Typography } from '@mui/material';
import type { CatalogBookItem } from '../../types/modules/catalog';

type Props = {
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
};

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
}: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Sơ đồ vị trí sách
                </Typography>
                <Grid container spacing={1}>
                    {pagedBooks.map((book) => (
                        <Grid key={book.id} size={{ xs: 12, sm: 4 }}>
                            <Box
                                onClick={() => onSelectBook(book.id)}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: selectedBookId === book.id ? '2px solid #2a7be3' : '1px solid #d6deef',
                                    background: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                <Typography sx={{ fontWeight: 700 }}>{book.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Trạng thái: {book.status === 'AVAILABLE' ? 'Còn' : 'Hết'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Còn khả dụng: {book.availableItems}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Đang chờ duyệt: {book.pendingRequests}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        disabled={book.availableItems <= 0}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            void onReserve(book.id);
                                        }}
                                    >
                                        Lập phiếu mượn
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        disabled={book.availableItems > 0}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            void onJoinWaitlist(book.id);
                                        }}
                                    >
                                        Hàng chờ
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
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
