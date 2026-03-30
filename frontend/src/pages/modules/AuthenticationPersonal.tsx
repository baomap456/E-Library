import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useAuthPersonal } from '../../hooks/modules/useAuthPersonal';

export default function AuthenticationPersonal() {
    const { profile, card, notifications, loading, error, qrData } = useAuthPersonal();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Module 1: Authentication & Personal
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Đăng nhập, đăng ký, hồ sơ hội viên và thông báo cá nhân.
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Trang cá nhân (Profile)
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 7 }}>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText primary="Họ tên" secondary={profile?.fullName || 'N/A'} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Username" secondary={profile?.username || 'N/A'} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Hạng hội viên" secondary={profile?.membership || 'Member'} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Số sách đang mượn" secondary={profile?.borrowingCount ?? 0} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Mã thẻ" secondary={card?.cardCode || 'N/A'} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 5 }}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: 'linear-gradient(180deg, #ffffff, #eef4ff)',
                                        }}
                                    >
                                        <Typography sx={{ mb: 1, fontWeight: 700 }}>Thẻ thư viện số (QR)</Typography>
                                        <Box
                                            component="img"
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`}
                                            alt="Library Card QR"
                                            sx={{ width: 160, height: 160, borderRadius: 2, border: '1px solid #d4ddf2' }}
                                        />
                                        <Typography variant="body2" sx={{ mt: 1.2, color: 'text.secondary' }}>
                                            Hạn thẻ: {card?.validUntil || 'N/A'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>
                                Thông báo (Notifications)
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <List dense>
                                {notifications.length === 0 && (
                                    <ListItem>
                                        <ListItemText primary="Chưa có thông báo." />
                                    </ListItem>
                                )}
                                {notifications.map((item) => (
                                    <ListItem key={item.id} sx={{ alignItems: 'flex-start' }}>
                                        <ListItemText
                                            primary={item.message}
                                            secondary={
                                                <Chip
                                                    size="small"
                                                    label={item.read ? 'Đã đọc' : 'Mới'}
                                                    color={item.read ? 'default' : 'secondary'}
                                                    sx={{ mt: 0.7 }}
                                                />
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
