import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

type SearchState = {
    q: string;
    author: string;
    category: string;
    publishYear: string;
    status: string;
};

type Props = {
    search: SearchState;
    setSearch: Dispatch<SetStateAction<SearchState>>;
    onApply: () => Promise<void>;
};

export default function CatalogFiltersCard({ search, setSearch, onApply }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Bộ lọc tìm kiếm
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
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => void onApply()}>
                    Áp dụng bộ lọc
                </Button>
            </CardContent>
        </Card>
    );
}
