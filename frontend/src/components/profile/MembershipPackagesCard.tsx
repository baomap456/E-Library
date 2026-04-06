import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import type { MembershipPackageResponse, ProfileResponse } from '../../types/modules/authPersonal';

type Props = {
    profile: ProfileResponse | null;
    packages: MembershipPackageResponse[];
    upgrading: boolean;
    onUpgrade: (targetPackage: string, paymentChannel?: 'QR' | 'COUNTER') => Promise<void>;
};

export default function MembershipPackagesCard({ profile, packages, upgrading, onUpgrade }: Props) {
    const [selectedPackage, setSelectedPackage] = useState<MembershipPackageResponse | null>(null);
    const qrPayload = useMemo(() => {
        if (!selectedPackage || !profile) {
            return '';
        }
        return `MEMBERSHIP_UPGRADE|${profile.username}|${selectedPackage.name}|${selectedPackage.price || 0}`;
    }, [profile, selectedPackage]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Gói thành viên thư viện
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.8 }}>
                    Gói trả phí có hạn mức mượn cao hơn, thời gian mượn dài hơn và quyền lợi ưu tiên nhiều hơn gói miễn phí.
                </Typography>
                <Grid container spacing={1.4}>
                    {packages.map((pkg) => {
                        const isCurrent = profile?.membership === pkg.name;
                        const benefits = Array.isArray(pkg.benefits) ? pkg.benefits : [];
                        return (
                            <Grid key={pkg.id} size={{ xs: 12, md: 6 }}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderWidth: isCurrent ? 2 : 1,
                                        borderColor: isCurrent ? '#2f6edb' : '#d4ddf2',
                                        background: pkg.paid
                                            ? 'linear-gradient(180deg, #fff8f1, #fff3e5)'
                                            : 'linear-gradient(180deg, #f8fbff, #eef4ff)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography sx={{ fontWeight: 800 }}>{pkg.name}</Typography>
                                        <Chip size="small" label={pkg.paid ? 'Paid' : 'Free'} color={pkg.paid ? 'secondary' : 'primary'} />
                                    </Box>
                                    {isCurrent && <Chip size="small" label="Gói hiện tại" sx={{ mb: 1 }} color="success" />}
                                    <Typography variant="body2" sx={{ mb: 0.6 }}>
                                        Hạn mức: {pkg.maxBooks} sách
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.6 }}>
                                        Thời hạn mượn: {pkg.borrowDurationDays} ngày
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.6 }}>
                                        Giá gói: {(pkg.price || 0).toLocaleString('vi-VN')} VND
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.6 }}>
                                        Phí trễ hạn: {pkg.fineRatePerDay.toLocaleString('vi-VN')} VND/ngày
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.9, color: 'text.secondary' }}>
                                        {pkg.privilegeNote}
                                    </Typography>
                                    <List dense sx={{ pt: 0 }}>
                                        {benefits.map((benefit) => (
                                            <ListItem key={benefit} sx={{ py: 0.2, px: 0 }}>
                                                <ListItemText primary={`- ${benefit}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    {!isCurrent && pkg.paid && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            disabled={upgrading}
                                            onClick={() => setSelectedPackage(pkg)}
                                            sx={{ mt: 1 }}
                                        >
                                            Nâng cấp bằng QR
                                        </Button>
                                    )}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                <Dialog open={Boolean(selectedPackage)} onClose={() => setSelectedPackage(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Nâng cấp bằng QR giả lập</DialogTitle>
                    <DialogContent>
                        <Stack spacing={1.2} sx={{ pt: 1 }}>
                            <Typography>
                                Gói: <strong>{selectedPackage?.name}</strong>
                            </Typography>
                            <Typography>
                                Số tiền: <strong>{(selectedPackage?.price || 0).toLocaleString('vi-VN')} VND</strong>
                            </Typography>
                            <Typography color="text.secondary">
                                Mã QR giả lập này đại diện cho giao dịch chuyển khoản của bạn.
                            </Typography>
                            <Box
                                component="img"
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload)}`}
                                alt="QR upgrade"
                                sx={{ width: 220, height: 220, alignSelf: 'center', borderRadius: 2, border: '1px solid #d4ddf2' }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                Sau khi quét QR, bấm xác nhận để lưu hoá đơn vào hệ thống. Nếu nâng cấp tại quầy, thủ thư sẽ thực hiện ở màn hình quản lý tài khoản.
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedPackage(null)}>Hủy</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (!selectedPackage) {
                                    return;
                                }
                                void onUpgrade(selectedPackage.name, 'QR');
                                setSelectedPackage(null);
                            }}
                            disabled={upgrading}
                        >
                            Xác nhận đã chuyển khoản
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}
