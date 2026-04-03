import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Pagination,
    Stack,
    Typography,
} from '@mui/material';
import type { CatalogBookItem } from '../../types/modules/catalog';

type Props = {
    books: CatalogBookItem[];
    bookPage: number;
    totalBookPages: number;
    showPagination: boolean;
    isStaff: boolean;
    onChangePage: (page: number) => void;
    onBorrow: (book: CatalogBookItem) => void;
    onWaitlist: (bookId: number) => void;
};

function HomeBookCard({
    book,
    onBorrow,
    onWaitlist,
    borrowDisabled,
    waitlistDisabled,
}: {
    book: CatalogBookItem;
    onBorrow: (book: CatalogBookItem) => void;
    onWaitlist: (bookId: number) => void;
    borrowDisabled: boolean;
    waitlistDisabled: boolean;
}) {
    const canBorrow = book.availableItems > 0 && book.pendingRequests <= 0;
    const authors = book.author.join(', ');
    const remainingCopies = book.availableItems;
    const stockLabel = remainingCopies > 0 ? `Còn lại: ${remainingCopies} cuốn` : 'Đã hết sách';

    return (
        <Card
            sx={{
                height: '100%',
                border: '1px solid rgba(16,67,159,0.12)',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
            }}
        >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box
                    sx={{
                        height: 150,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'end',
                        p: 1.5,
                        color: '#fff',
                        background: book.coverImageUrl
                            ? `linear-gradient(180deg, rgba(16, 67, 159, 0.15), rgba(16, 67, 159, 0.78)), url(${book.coverImageUrl}) center/cover`
                            : 'linear-gradient(135deg, #10439f 0%, #2a7be3 55%, #66a7ff 100%)',
                    }}
                >
                    <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>
                        {book.digital ? 'Tài nguyên số' : 'Sách in'}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.25, mb: 0.5 }}>
                        {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {authors}
                    </Typography>
                    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', mb: 1.25 }}>
                        <Chip label={book.category} size="small" />
                        <Chip label={`${book.publishYear}`} size="small" variant="outlined" />
                        <Chip
                            label={book.status === 'AVAILABLE' ? 'Còn sách' : book.status === 'BORROWED' ? 'Đang mượn' : 'Không khả dụng'}
                            size="small"
                            color={book.status === 'AVAILABLE' ? 'success' : 'default'}
                        />
                        <Chip label={stockLabel} size="small" color={remainingCopies > 0 ? 'success' : 'default'} />
                    </Stack>
                    <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            ISBN: {book.isbn}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Số lượng còn lại: {remainingCopies} cuốn
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Đang chờ: {book.pendingRequests} yêu cầu
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => onBorrow(book)}
                        disabled={!canBorrow || borrowDisabled}
                    >
                        {borrowDisabled ? 'Thủ thư không tự mượn' : book.pendingRequests > 0 ? 'Ưu tiên hàng chờ' : 'Lập phiếu mượn sách'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => onWaitlist(book.id)}
                        disabled={waitlistDisabled}
                    >
                        {waitlistDisabled ? 'Thủ thư không vào hàng đợi' : 'Đợi sách'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function HomeBooksSection({
    books,
    bookPage,
    totalBookPages,
    showPagination,
    isStaff,
    onChangePage,
    onBorrow,
    onWaitlist,
}: Props) {
    return (
        <Stack spacing={2.4}>
            <Grid container spacing={2.2}>
                {books.length > 0 ? books.map((book) => (
                    <Grid key={book.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <HomeBookCard
                            book={book}
                            onBorrow={onBorrow}
                            onWaitlist={onWaitlist}
                            borrowDisabled={isStaff}
                            waitlistDisabled={isStaff}
                        />
                    </Grid>
                )) : (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Không tìm thấy sách phù hợp với bộ lọc hiện tại.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {showPagination && books.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        color="primary"
                        count={totalBookPages}
                        page={bookPage}
                        onChange={(_, nextPage) => onChangePage(nextPage)}
                    />
                </Box>
            )}
        </Stack>
    );
}
