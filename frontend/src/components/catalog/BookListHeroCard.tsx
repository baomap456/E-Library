import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

type Props = Readonly<{
    booksCount: number;
    filteredCount: number;
    pendingCount: number;
}>;

export default function BookListHeroCard({ booksCount, filteredCount, pendingCount }: Props) {
    return (
        <Card
            sx={{
                mb: 3,
                border: '1px solid rgba(16,67,159,0.12)',
                background: 'linear-gradient(135deg, rgba(16,67,159,0.98) 0%, rgba(42,123,227,0.96) 55%, rgba(102,167,255,0.94) 100%)',
                color: '#fff',
                boxShadow: '0 24px 50px rgba(16,67,159,0.12)',
            }}
        >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={2.5} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={1.6}>
                            <Chip label="Khám phá sách" sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.16)', color: '#fff', fontWeight: 700 }} />
                            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
                                Danh mục sách như một gian hàng thương mại điện tử.
                            </Typography>
                            <Typography sx={{ maxWidth: 820, lineHeight: 1.7, opacity: 0.95 }}>
                                Lọc theo thể loại, tác giả, năm xuất bản và trạng thái; mở từng cuốn như một sản phẩm,
                                xem chi tiết, rồi gửi phiếu mượn hoặc vào hàng chờ ngay trên cùng một trang.
                            </Typography>
                            <Stack direction="row" spacing={1.2} useFlexGap sx={{ flexWrap: 'wrap' }}>
                                <Chip label={`${booksCount} đầu sách`} sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                <Chip label={`${filteredCount} kết quả`} sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                <Chip label={`${pendingCount} đang chờ`} sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.9)', letterSpacing: 1.4 }}>
                                Gợi ý hôm nay
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, mb: 1.2 }}>
                                Tra cứu như xem sản phẩm
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.92 }}>
                                Chọn đúng cuốn, xem mô tả, rồi mới lập phiếu mượn hoặc đặt trước.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}