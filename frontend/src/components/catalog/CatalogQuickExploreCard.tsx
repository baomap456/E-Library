import { Box, Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material';
import type { CatalogHomeResponse } from '../../types/modules/catalog';

type Props = {
    home: CatalogHomeResponse | null;
    query: string;
    onQueryChange: (value: string) => void;
};

export default function CatalogQuickExploreCard({ home, query, onQueryChange }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Khám phá nhanh
                </Typography>
                <TextField
                    fullWidth
                    placeholder={home?.searchPlaceholder || 'Tìm theo tên sách, tác giả, ISBN...'}
                    sx={{ mb: 2 }}
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
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
    );
}
