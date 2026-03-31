import { Button, Card, CardContent, Grid, Paper, Typography } from '@mui/material';

type Props = {
    onNavigate: (path: string) => void;
};

export default function ProfileQuickActionsCard({ onNavigate }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Hôm nay bạn cần làm gì?
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.8 }}>
                    Chọn nhanh tác vụ phù hợp: tra cứu sách, tạo phiếu mượn, tham gia hàng chờ hoặc đọc tài liệu số.
                </Typography>
                <Grid container spacing={1.4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Tra cứu sách</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Tìm sách theo tên, tác giả, thể loại và xem tồn kho thực tế.
                            </Typography>
                            <Button variant="contained" onClick={() => onNavigate('/app/catalog')}>Đi tới Catalog</Button>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Lập phiếu mượn</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Chọn sách để gửi yêu cầu mượn và theo dõi trạng thái duyệt.
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={() => onNavigate('/app/borrowing')}>Mượn trả của tôi</Button>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Hàng chờ sách</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Khi sách hết bản khả dụng, vào hàng chờ trực tiếp trên từng sách.
                            </Typography>
                            <Button variant="outlined" onClick={() => onNavigate('/app/catalog')}>Vào hàng chờ</Button>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Thư viện số</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Đọc tài liệu số, truy cập nhanh các tài liệu học thuật.
                            </Typography>
                            <Button variant="outlined" onClick={() => onNavigate('/app/digital')}>Mở thư viện số</Button>
                        </Paper>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
