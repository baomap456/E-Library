import { Box, Card, CardContent, Chip, Stack, TextField, Typography, MenuItem } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

type SearchState = {
    q: string;
    author: string;
    category: string;
    publishYear: string;
    status: string;
};

type Props = Readonly<{
    search: SearchState;
    setSearch: Dispatch<SetStateAction<SearchState>>;
    categoryOptions: string[];
}>;

export default function BookListFiltersPanel({ search, setSearch, categoryOptions }: Props) {
    return (
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
            <Stack spacing={2.2}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>
                            Tìm nhanh trong kho
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.6 }}>
                            Tìm giống thanh tìm kiếm của một sàn thương mại điện tử.
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Tìm theo tên, ISBN, tác giả..."
                            value={search.q}
                            onChange={(event) => setSearch((prev) => ({ ...prev, q: event.target.value }))}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>
                            Lọc theo nhu cầu
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.6 }}>
                            Chọn đúng cuốn như chọn sản phẩm trong một gian hàng.
                        </Typography>
                        <Stack spacing={1.2}>
                            <TextField
                                fullWidth
                                label="Tác giả"
                                value={search.author}
                                onChange={(event) => setSearch((prev) => ({ ...prev, author: event.target.value }))}
                            />
                            <TextField
                                fullWidth
                                label="Thể loại"
                                value={search.category}
                                onChange={(event) => setSearch((prev) => ({ ...prev, category: event.target.value }))}
                            />
                            <TextField
                                select
                                fullWidth
                                label="Năm xuất bản"
                                value={search.publishYear}
                                onChange={(event) => setSearch((prev) => ({ ...prev, publishYear: event.target.value }))}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[2026, 2025, 2024, 2023].map((year) => (
                                    <MenuItem key={year} value={String(year)}>{year}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Trạng thái"
                                value={search.status}
                                onChange={(event) => setSearch((prev) => ({ ...prev, status: event.target.value }))}
                            >
                                <MenuItem value="available">Còn hàng</MenuItem>
                                <MenuItem value="unavailable">Đã hết</MenuItem>
                                <MenuItem value="">Tất cả</MenuItem>
                            </TextField>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>
                            Phân loại nhanh
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                            <Chip label="Sách in" />
                            <Chip label="Tài nguyên số" />
                            <Chip label="Sách đang còn" color="success" />
                            <Chip label="Sách đang chờ" color="secondary" />
                            {categoryOptions.slice(0, 5).map((category) => (
                                <Chip key={category} label={category} variant="outlined" />
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}