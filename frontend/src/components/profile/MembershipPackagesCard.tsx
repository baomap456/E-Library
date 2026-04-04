import { Box, Button, Card, CardContent, Chip, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import type { MembershipPackageResponse, ProfileResponse } from '../../types/modules/authPersonal';

type Props = {
    profile: ProfileResponse | null;
    packages: MembershipPackageResponse[];
    upgrading: boolean;
    onUpgrade: (targetPackage: string) => Promise<void>;
};

export default function MembershipPackagesCard({ profile, packages, upgrading, onUpgrade }: Props) {
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
                                            onClick={() => void onUpgrade(pkg.name)}
                                            sx={{ mt: 1 }}
                                        >
                                            {upgrading ? 'Đang nâng cấp...' : `Nâng cấp lên ${pkg.name}`}
                                        </Button>
                                    )}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
}
