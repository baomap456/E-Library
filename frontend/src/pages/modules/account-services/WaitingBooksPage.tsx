import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BorrowingWaitlistCard from '../../../components/borrowing/BorrowingWaitlistCard';
import { useAuthPersonal } from '../../../hooks/modules/useAuthPersonal';

export default function WaitingBooksPage() {
    const navigate = useNavigate();
    const { waitlist, loading, error } = useAuthPersonal();

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
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Sách đang chờ</Typography>
                    <Typography color="text.secondary">Theo dõi vị trí chờ và thời hạn nhận sách trong hàng đợi.</Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/app/profile')}>Về tài khoản của tôi</Button>
            </Stack>
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            <BorrowingWaitlistCard waitlist={waitlist} />
        </Box>
    );
}
