import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useCatalogDiscovery } from '../../hooks/modules/useCatalogDiscovery';

export default function CatalogDiscovery() {
    const {
        books,
        home,
        detail,
        loading,
        error,
        search,
        setSearch,
        selectedBook,
        setSelectedBookId,
        loadBooks,
        handleReserve,
    } = useCatalogDiscovery();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Module 2: Catalog & Discovery
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Trang chủ, tìm kiếm nâng cao, chi tiết sách và sơ đồ vị trí kệ.
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>
                                Trang chủ (Home)
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder={home?.searchPlaceholder || 'Tìm theo tên sách, tác giả, ISBN...'}
                                sx={{ mb: 2 }}
                                value={search.q}
                                onChange={(e) => setSearch((prev) => ({ ...prev, q: e.target.value }))}
                            />
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                                {(home?.newArrivals || []).slice(0, 2).map((book) => (
                                    <Chip key={book.id} label={`Sách mới: ${book.title}`} color="primary" />
                                ))}
                                {(home?.mostBorrowed || []).slice(0, 1).map((book) => (
                                    <Chip key={book.id} label={`Mượn nhiều: ${book.title}`} color="secondary" />
                                ))}
                            </Stack>
                            <Box
                                sx={{
                                    height: 110,
                                    borderRadius: 2,
                                    background: 'linear-gradient(90deg, #0f4ca9 0%, #2a7be3 65%, #66a7ff 100%)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: 3,
                                    fontWeight: 700,
                                }}
                            >
                                {(home?.banners && home.banners[0]) || 'Sự kiện thư viện'}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>
                                Tìm kiếm nâng cao
                            </Typography>
                            <Grid container spacing={1.2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Tác giả"
                                        value={search.author}
                                        onChange={(e) => setSearch((prev) => ({ ...prev, author: e.target.value }))}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Thể loại"
                                        value={search.category}
                                        onChange={(e) => setSearch((prev) => ({ ...prev, category: e.target.value }))}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Năm xuất bản"
                                        value={search.publishYear}
                                        onChange={(e) => setSearch((prev) => ({ ...prev, publishYear: e.target.value }))}
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="2026">2026</MenuItem>
                                        <MenuItem value="2025">2025</MenuItem>
                                        <MenuItem value="2024">2024</MenuItem>
                                        <MenuItem value="2023">2023</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Trạng thái"
                                        value={search.status}
                                        onChange={(e) => setSearch((prev) => ({ ...prev, status: e.target.value }))}
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="available">Còn</MenuItem>
                                        <MenuItem value="unavailable">Hết</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Button variant="contained" sx={{ mt: 2 }} onClick={() => void loadBooks()}>
                                Áp dụng bộ lọc
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
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
                            <Button variant="contained" color="secondary" onClick={handleReserve} disabled={!selectedBook}>
                                Đặt mượn online
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.2 }}>
                                Sơ đồ vị trí sách
                            </Typography>
                            <Grid container spacing={1}>
                                {books.slice(0, 6).map((book) => (
                                    <Grid key={book.id} size={{ xs: 12, sm: 4 }}>
                                        <Box
                                            onClick={() => setSelectedBookId(book.id)}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                border: selectedBook?.id === book.id ? '2px solid #2a7be3' : '1px solid #d6deef',
                                                background: '#fff',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 700 }}>{book.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Trạng thái: {book.status === 'AVAILABLE' ? 'Còn' : 'Hết'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
