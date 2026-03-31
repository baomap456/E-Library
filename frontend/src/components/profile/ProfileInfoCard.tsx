import { Box, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import type { CardResponse, ProfileResponse } from '../../types/modules/authPersonal';

type Props = {
    profile: ProfileResponse | null;
    card: CardResponse | null;
    qrData: string;
    renewing: boolean;
    onRenew: () => Promise<void>;
};

export default function ProfileInfoCard({ profile, card, qrData, renewing, onRenew }: Props) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Hồ sơ bạn đọc
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
                                <ListItemText
                                    primary="Loại gói"
                                    secondary={profile?.membershipPaid ? 'Trả phí (Paid)' : 'Miễn phí (Free)'}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Quyền lợi hiện tại"
                                    secondary={`${profile?.membershipMaxBooks ?? 0} sách / ${profile?.membershipBorrowDurationDays ?? 0} ngày`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Hạn gói trả phí"
                                    secondary={profile?.membershipExpiresAt
                                        ? `${String(profile.membershipExpiresAt).slice(0, 10)} (${profile.membershipDaysRemaining ?? 0} ngày còn lại)`
                                        : 'Không áp dụng cho gói Free'}
                                />
                            </ListItem>
                            {profile?.membershipPaid && (
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={renewing}
                                        onClick={() => void onRenew()}
                                    >
                                        {renewing ? 'Đang gia hạn...' : 'Gia hạn thêm 1 năm'}
                                    </Button>
                                </ListItem>
                            )}
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
    );
}
