import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

type HomeSimpleBook = {
    id: number;
    title: string;
};

type ActionLink = {
    label: string;
    to: string;
};

type Props = {
    latestBooks: HomeSimpleBook[];
    popularBooks: HomeSimpleBook[];
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    token: string | null;
};

function SimpleBookList({ books }: { books: HomeSimpleBook[] }) {
    if (books.length === 0) {
        return <Typography color="text.secondary">Chưa có dữ liệu.</Typography>;
    }

    return (
        <Stack spacing={1}>
            {books.slice(0, 3).map((book) => (
                <Box key={book.id} sx={{ p: 1.25, borderRadius: 2, background: '#f8fbff', border: '1px solid #e5ebf5' }}>
                    <Typography sx={{ fontWeight: 700 }}>{book.title}</Typography>
                </Box>
            ))}
        </Stack>
    );
}

export default function HomeHighlightsSection({
    latestBooks,
    popularBooks,
    primaryAction,
    secondaryAction,
    token,
}: Props) {
    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>
                            Sách mới
                        </Typography>
                        <SimpleBookList books={latestBooks} />
                        <Button
                            component={RouterLink}
                            to={token ? '/app/book-list' : '/login'}
                            variant="text"
                            sx={{ mt: 1.25, px: 0 }}
                        >
                            Xem thêm
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>
                            Sách được quan tâm
                        </Typography>
                        <SimpleBookList books={popularBooks} />
                        <Button
                            component={RouterLink}
                            to={token ? '/app/book-list' : '/login'}
                            variant="text"
                            sx={{ mt: 1.25, px: 0 }}
                        >
                            Xem thêm
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>
                            Lối vào nhanh
                        </Typography>
                        <Stack spacing={1.1}>
                            <Button component={RouterLink} to={primaryAction.to} variant="contained" fullWidth>
                                {primaryAction.label}
                            </Button>
                            <Button component={RouterLink} to={secondaryAction.to} variant="outlined" fullWidth>
                                {secondaryAction.label}
                            </Button>
                            <Button component={RouterLink} to={token ? '/app/borrowing' : '/login'} variant="text" fullWidth>
                                {token ? 'Mượn trả' : 'Đăng nhập để mượn sách'}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
