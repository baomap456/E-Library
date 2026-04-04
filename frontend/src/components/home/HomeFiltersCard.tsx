import {
    Box,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import type { HomeSearchState } from './types';

type Props = {
    search: HomeSearchState;
    onChange: (field: keyof HomeSearchState, value: string) => void;
    categoryOptions: string[];
    authorOptions: string[];
    yearOptions: number[];
};

export default function HomeFiltersCard({ search, onChange, categoryOptions, authorOptions, yearOptions }: Props) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                            Danh sách sách
                        </Typography>
                        <Typography color="text.secondary">
                            Lọc theo thể loại, tác giả và năm sản xuất rồi duyệt qua từng trang ngay trên trang chủ.
                        </Typography>
                    </Box>

                    <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Tìm theo tên, ISBN"
                                value={search.q}
                                onChange={(event) => onChange('q', event.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Sách theo thể loại"
                                value={search.category}
                                onChange={(event) => onChange('category', event.target.value)}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                {categoryOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Sách theo tác giả"
                                value={search.author}
                                onChange={(event) => onChange('author', event.target.value)}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                {authorOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Sách theo năm sản xuất"
                                value={search.publishYear}
                                onChange={(event) => onChange('publishYear', event.target.value)}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                {yearOptions.map((option) => (
                                    <MenuItem key={option} value={String(option)}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
}
