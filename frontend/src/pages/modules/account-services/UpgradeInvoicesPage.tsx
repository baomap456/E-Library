import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MembershipTransactionsCard from '../../../components/profile/MembershipTransactionsCard';
import { useAuthPersonal } from '../../../hooks/modules/useAuthPersonal';

export default function UpgradeInvoicesPage() {
    const navigate = useNavigate();
    const { transactions, loading, error } = useAuthPersonal();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ mb: 2.2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Hoá đơn nâng cấp</Typography>
                    <Typography color="text.secondary">Theo dõi toàn bộ giao dịch nâng cấp, gia hạn và thay đổi gói thành viên.</Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/app/profile')}>Về tài khoản của tôi</Button>
            </Stack>
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            <MembershipTransactionsCard transactions={transactions} />
        </Box>
    );
}
