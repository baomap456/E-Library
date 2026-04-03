import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import type { CatalogBookDetailResponse, CatalogBookItem } from '../../types/modules/catalog';

type Props = Readonly<{
    book: CatalogBookItem | null;
    detail: CatalogBookDetailResponse | null;
    authors: string;
    canReserve: boolean;
    reserveDisabledMessage?: string;
    canJoinWaitlist: boolean;
    waitlistDisabledMessage?: string;
    onReserve: () => void;
    onJoinWaitlist: () => void;
}>;

export default function BookDetailInfoCard({
    book,
    detail,
    authors,
    canReserve,
    reserveDisabledMessage,
    canJoinWaitlist,
    waitlistDisabledMessage,
    onReserve,
    onJoinWaitlist,
}: Props) {
    return (
        <Card sx={{ border: '1px solid rgba(16,67,159,0.12)' }}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box
                            sx={{
                                minHeight: 360,
                                borderRadius: 3,
                                color: '#fff',
                                p: 2.5,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                background: book?.coverImageUrl
                                    ? `linear-gradient(180deg, rgba(16,67,159,0.12), rgba(16,67,159,0.82)), url(${book.coverImageUrl}) center/cover`
                                    : 'linear-gradient(135deg, #10439f 0%, #2a7be3 56%, #66a7ff 100%)',
                            }}
                        >
                            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                                <Chip label={book?.digital ? 'Tài nguyên số' : 'Sách in'} sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                <Chip label={book?.category || 'Danh mục'} sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                            </Stack>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 1 }}>
                                    {book?.title}
                                </Typography>
                                <Typography sx={{ opacity: 0.95 }}>{authors}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                                    Thông tin chi tiết sách
                                </Typography>
                                <Typography color="text.secondary">
                                    Trang chi tiết kiểu sản phẩm: xem mô tả, vị trí, tình trạng kho và thao tác ngay.
                                </Typography>
                            </Box>

                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fbff', border: '1px solid #e4ebf6' }}>
                                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Mô tả</Typography>
                                <Typography color="text.secondary">{detail?.description || 'Chưa có mô tả nội dung.'}</Typography>
                            </Box>

                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fbff', border: '1px solid #e4ebf6' }}>
                                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Vị trí kệ</Typography>
                                <Typography color="text.secondary">{detail?.location || 'N/A'}</Typography>
                            </Box>

                            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                                <Chip label={`ISBN: ${book?.isbn || 'N/A'}`} variant="outlined" />
                                <Chip label={`Năm xuất bản: ${book?.publishYear || 'N/A'}`} variant="outlined" />
                                <Chip label={`Khả dụng: ${book?.availableItems ?? 0}`} color="success" />
                                <Chip label={`Đang chờ: ${book?.pendingRequests ?? 0}`} color="secondary" />
                            </Stack>

                            <Stack direction="row" spacing={1.5}>
                                <Button variant="contained" color="secondary" onClick={onReserve} disabled={!book || book.availableItems <= 0 || !canReserve}>
                                    {canReserve ? 'Lập phiếu mượn sách' : reserveDisabledMessage || 'Thủ thư không thể mượn cho chính mình'}
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onJoinWaitlist} disabled={!book || book.availableItems > 0 || !canJoinWaitlist}>
                                    {canJoinWaitlist ? 'Đặt trước' : waitlistDisabledMessage || 'Thủ thư không vào hàng đợi'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}