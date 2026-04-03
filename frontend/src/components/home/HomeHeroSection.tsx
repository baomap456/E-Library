import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

type ActionLink = {
    label: string;
    to: string;
};

type Props = {
    token: string | null;
    isStaff: boolean;
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    bannerText: string;
    searchPlaceholder: string;
    latestCount: number;
    popularCount: number;
    filteredCount: number;
};

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}

function HeroCard({ title, value }: { title: string; value: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(16,67,159,0.10)',
                boxShadow: '0 14px 30px rgba(16,67,159,0.08)',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
            <Typography sx={{ fontWeight: 800, mt: 0.25 }}>{value}</Typography>
        </Box>
    );
}

export default function HomeHeroSection({
    token,
    isStaff,
    primaryAction,
    secondaryAction,
    bannerText,
    searchPlaceholder,
    latestCount,
    popularCount,
    filteredCount,
}: Props) {
    return (
        <Grid container spacing={3.5} alignItems="stretch">
            <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={2.2} sx={{ height: '100%', justifyContent: 'center' }}>
                    <Chip
                        label={token ? (isStaff ? 'Cổng thư viện - Thủ thư' : 'Cổng thư viện - Bạn đọc') : 'Cổng thư viện - Khách vãng lai'}
                        sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                    />
                    <Box>
                        <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.05, mb: 1.2 }}>
                            Mở cánh cửa thư viện để tra cứu, mượn và theo dõi sách.
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.6 }}>
                            Tra cứu kho sách theo thể loại, tác giả hoặc năm xuất bản; xem sách mới, sách được quan tâm và
                            thao tác mượn hoặc đợi sách ngay trên cùng một cổng thư viện.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        <Button component={RouterLink} to={primaryAction.to} variant="contained" size="large">
                            {primaryAction.label}
                        </Button>
                        <Button component={RouterLink} to={secondaryAction.to} variant="outlined" size="large">
                            {secondaryAction.label}
                        </Button>
                    </Stack>

                    <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <StatCard label="Sách mới nhập kho" value={String(latestCount)} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <StatCard label="Sách được quan tâm" value={String(popularCount)} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <StatCard label="Kết quả tra cứu" value={String(filteredCount)} />
                        </Grid>
                    </Grid>
                </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
                <Card
                    sx={{
                        height: '100%',
                        border: '1px solid rgba(16, 67, 159, 0.12)',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(239,245,255,0.96))',
                        boxShadow: '0 24px 50px rgba(16, 67, 159, 0.08)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2.2}>
                            <Box>
                                <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'primary.main' }}>
                                    Khám phá thư viện
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5 }}>
                                    {searchPlaceholder}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 2.2,
                                    minHeight: 140,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    color: '#fff',
                                    background: 'linear-gradient(135deg, #10439f 0%, #2a7be3 55%, #66a7ff 100%)',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                                    Gợi ý hôm nay
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
                                    {bannerText}
                                </Typography>
                            </Box>

                            <Grid container spacing={1.2}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <HeroCard title="Khách" value="Khám phá kho sách" />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <HeroCard title="Bạn đọc" value="Mượn và đặt chờ" />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <HeroCard title="Thủ thư" value="Quản trị vận hành" />
                                </Grid>
                            </Grid>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
