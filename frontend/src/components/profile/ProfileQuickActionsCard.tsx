import { Button, Card, CardContent, Grid, Paper, Typography } from '@mui/material';

type Props = {
    onNavigate: (path: string) => void;
};

export default function ProfileQuickActionsCard({ onNavigate }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Đi tới khu vực phù hợp
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.8 }}>
                    Hồ sơ chỉ hiển thị thông tin cá nhân. Mọi thao tác tra cứu và đọc danh sách sách nằm ở các trang riêng.
                </Typography>
                <Grid container spacing={1.4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Trang chủ chung</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Xem danh sách nổi bật, bộ lọc và các nút mượn/đợi sách ngay trên trang chủ.
                            </Typography>
                            <Button variant="contained" onClick={() => onNavigate('/')}>Vào trang chủ</Button>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>BookList</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Trang riêng để duyệt toàn bộ danh sách sách theo kiểu BookList.
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={() => onNavigate('/app/book-list')}>Mở BookList</Button>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Trang cá nhân</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Xem thông tin tài khoản, thẻ thư viện và thông báo.
                            </Typography>
                            <Button variant="outlined" onClick={() => onNavigate('/app/profile')}>Xem hồ sơ</Button>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.6 }}>Đăng xuất</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                                Kết thúc phiên làm việc khi không dùng nữa.
                            </Typography>
                            <Button variant="outlined" onClick={() => onNavigate('/login')}>Đăng xuất / đăng nhập lại</Button>
                        </Paper>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
