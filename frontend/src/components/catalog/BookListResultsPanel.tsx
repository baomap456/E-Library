import { Box, Card, CardContent, Grid, Pagination, Stack, Typography } from '@mui/material';
import type { CatalogBookItem } from '../../types/modules/catalog';
import CatalogBookDetailCard from './CatalogBookDetailCard';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Chip } from '@mui/material';

type ProductCardProps = {
    book: CatalogBookItem;
    selected: boolean;
    canReserve: boolean;
    canJoinWaitlist: boolean;
    onSelect: (bookId: number) => void;
    onReserve: (book: CatalogBookItem) => void;
    onJoinWaitlist: (bookId: number) => void;
};

function ProductCard({ book, selected, canReserve, canJoinWaitlist, onSelect, onReserve, onJoinWaitlist }: ProductCardProps) {
    const authors = book.author.join(', ');
    const stockLabel = book.availableItems > 0 ? `Còn lại: ${book.availableItems} cuốn` : 'Đã hết sách';

    return (
        <Card
            onClick={() => onSelect(book.id)}
            sx={{
                height: '100%',
                cursor: 'pointer',
                border: selected ? '2px solid #f27b22' : '1px solid rgba(16,67,159,0.12)',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                boxShadow: selected ? '0 18px 35px rgba(242,123,34,0.16)' : '0 10px 22px rgba(16,67,159,0.08)',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 20px 35px rgba(16,67,159,0.12)',
                },
            }}
        >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.3 }}>
                <Box
                    sx={{
                        height: 190,
                        borderRadius: 3,
                        p: 1.5,
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: book.coverImageUrl
                            ? `linear-gradient(180deg, rgba(16,67,159,0.10), rgba(16,67,159,0.82)), url(${book.coverImageUrl}) center/cover`
                            : 'linear-gradient(135deg, #10439f 0%, #2a7be3 56%, #66a7ff 100%)',
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Chip label={book.digital ? 'Tài nguyên số' : 'Sách in'} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
                        <Chip label={stockLabel} size="small" color={book.availableItems > 0 ? 'success' : 'default'} sx={{ bgcolor: 'rgba(255,255,255,0.96)' }} />
                    </Stack>
                    <Box>
                        <Typography sx={{ fontWeight: 900, lineHeight: 1.2, fontSize: 18, mb: 0.6 }}>
                            {book.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.92 }}>
                            {authors}
                        </Typography>
                    </Box>
                </Box>

                <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    <Chip label={book.category} size="small" />
                    <Chip label={`${book.publishYear}`} size="small" variant="outlined" />
                    <Chip label={`Đang chờ ${book.pendingRequests}`} size="small" variant="outlined" />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                    ISBN: {book.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Số lượng còn lại: {book.availableItems} cuốn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Trạng thái: {book.status === 'AVAILABLE' ? 'Còn hàng' : book.status === 'BORROWED' ? 'Đang được mượn' : 'Không khả dụng'}
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={(event) => {
                            event.stopPropagation();
                            onReserve(book);
                        }}
                        disabled={!canReserve || book.availableItems <= 0}
                    >
                        {canReserve ? 'Lập phiếu mượn sách' : 'Thủ thư không tự mượn'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            onJoinWaitlist(book.id);
                        }}
                        disabled={!canJoinWaitlist || book.availableItems > 0}
                    >
                        {canJoinWaitlist ? 'Đặt trước' : 'Thủ thư không vào hàng đợi'}
                    </Button>
                </Stack>

                <Button
                    component={RouterLink}
                    to={`/app/book-detail/${book.id}`}
                    variant="text"
                    sx={{ alignSelf: 'flex-start', px: 0 }}
                    onClick={(event) => event.stopPropagation()}
                >
                    Xem chi tiết sách
                </Button>
            </CardContent>
        </Card>
    );
}

type Props = Readonly<{
    selectedBook: CatalogBookItem | null;
    previewBooks: CatalogBookItem[];
    pagedBooks: CatalogBookItem[];
    booksPerPage: number;
    currentBookPage: number;
    totalBookPages: number;
    onSelectBook: (bookId: number) => void;
    onReserve: (book: CatalogBookItem) => void;
    onJoinWaitlist: (bookId: number) => void;
    canReserve: boolean;
    canJoinWaitlist: boolean;
    onChangePage: (page: number) => void;
}>;

export default function BookListResultsPanel({
    selectedBook,
    previewBooks,
    pagedBooks,
    booksPerPage,
    currentBookPage,
    totalBookPages,
    onSelectBook,
    onReserve,
    onJoinWaitlist,
    canReserve,
    canJoinWaitlist,
    onChangePage,
}: Props) {
    return (
        <Stack spacing={2.2}>
            <Card>
                <CardContent>
                    <Grid container spacing={2.2} alignItems="stretch">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <CatalogBookDetailCard
                                selectedBook={selectedBook}
                                detail={null}
                                onReserve={async () => {
                                    if (selectedBook) {
                                        onReserve(selectedBook);
                                    }
                                }}
                                onJoinWaitlist={async (bookId) => {
                                    onJoinWaitlist(bookId);
                                }}
                                canReserve={canReserve}
                                reserveDisabledMessage="Thủ thư không tự mượn"
                                canJoinWaitlist={canJoinWaitlist}
                                waitlistDisabledMessage="Thủ thư không vào hàng đợi"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box sx={{ height: '100%', borderRadius: 2, border: '1px solid #d9e2f0', p: 2, background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)' }}>
                                <Typography variant="h6" sx={{ mb: 0.5 }}>
                                    Sách đang xem
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Nhấn vào một thẻ sách bên dưới để cập nhật chi tiết ngay, giống trải nghiệm xem sản phẩm.
                                </Typography>
                                <Stack spacing={1.2}>
                                    {previewBooks.map((item) => (
                                        <Box key={item.id} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e4ebf6', background: '#fff' }}>
                                            <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">Sách mới trong kho thư viện</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                Danh sách sách
                            </Typography>
                            <Typography color="text.secondary">
                                Mỗi cuốn là một thẻ sản phẩm: xem bìa, trạng thái, khả dụng và thao tác ngay tại chỗ.
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Đang hiển thị {pagedBooks.length} / {booksPerPage} kết quả trên trang {currentBookPage} trong tổng {totalBookPages} trang.
                        </Typography>
                    </Stack>

                    {pagedBooks.length === 0 ? (
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                                Không tìm thấy cuốn sách nào phù hợp
                            </Typography>
                            <Typography color="text.secondary">
                                Hãy thử đổi bộ lọc, tác giả hoặc năm xuất bản để xem thêm sản phẩm.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {pagedBooks.map((book) => (
                                <Grid key={book.id} size={{ xs: 12, sm: 6, xl: 4 }}>
                                    <ProductCard
                                        book={book}
                                        selected={selectedBook?.id === book.id}
                                        onSelect={onSelectBook}
                                        onReserve={onReserve}
                                        onJoinWaitlist={onJoinWaitlist}
                                        canReserve={canReserve}
                                        canJoinWaitlist={canJoinWaitlist}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {pagedBooks.length > 0 && totalBookPages > 1 && (
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <Pagination color="primary" page={currentBookPage} count={totalBookPages} onChange={(_, next) => onChangePage(next)} />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Stack>
    );
}