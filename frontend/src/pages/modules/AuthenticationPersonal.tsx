import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BorrowingFinesCard from '../../components/borrowing/BorrowingFinesCard';
import BorrowingRecordsCard from '../../components/borrowing/BorrowingRecordsCard';
import BorrowingRequestsCard from '../../components/borrowing/BorrowingRequestsCard';
import BorrowingWaitlistCard from '../../components/borrowing/BorrowingWaitlistCard';
import MembershipPackagesCard from '../../components/profile/MembershipPackagesCard';
import MembershipTransactionsCard from '../../components/profile/MembershipTransactionsCard';
import ProfileInfoCard from '../../components/profile/ProfileInfoCard';
import ProfilePageHeader from '../../components/profile/ProfilePageHeader';
import { useAuthPersonal } from '../../hooks/modules/useAuthPersonal';

export default function AuthenticationPersonal() {
    const navigate = useNavigate();
    const {
        profile,
        card,
        qrData,
        packages,
        transactions,
        myRequests,
        records,
        waitlist,
        fines,
        upgrading,
        renewingRecordId,
        handleUpgrade,
        handleRenewBorrowRecord,
        loading,
        error,
    } = useAuthPersonal();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.2}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
                <Box sx={{ flex: 1 }}>
                    <ProfilePageHeader />
                </Box>
                <Button variant="outlined" onClick={() => navigate('/')} sx={{ mb: { xs: 2, sm: 3 } }}>
                    Quay về trang chủ
                </Button>
            </Stack>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12 }}>
                    <ProfileInfoCard
                        profile={profile}
                        card={card}
                        qrData={qrData}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <MembershipPackagesCard
                        profile={profile}
                        packages={packages}
                        upgrading={upgrading}
                        onUpgrade={handleUpgrade}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <MembershipTransactionsCard transactions={transactions} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <BorrowingRecordsCard
                        records={records}
                        renewingRecordId={renewingRecordId}
                        onRenew={handleRenewBorrowRecord}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <BorrowingRequestsCard myRequests={myRequests} />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <BorrowingWaitlistCard waitlist={waitlist} />
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <BorrowingFinesCard fines={fines} showPayButton={false} />
                </Grid>
            </Grid>
        </Box>
    );
}
