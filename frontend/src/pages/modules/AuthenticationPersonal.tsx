import {
    Alert,
    Box,
    CircularProgress,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MembershipPackagesCard from '../../components/profile/MembershipPackagesCard';
import MembershipTransactionsCard from '../../components/profile/MembershipTransactionsCard';
import ProfileInfoCard from '../../components/profile/ProfileInfoCard';
import ProfileNotificationsCard from '../../components/profile/ProfileNotificationsCard';
import ProfilePageHeader from '../../components/profile/ProfilePageHeader';
import ProfileQuickActionsCard from '../../components/profile/ProfileQuickActionsCard';
import { hasRole } from '../../api/session';
import { useAuthPersonal } from '../../hooks/modules/useAuthPersonal';

export default function AuthenticationPersonal() {
    const navigate = useNavigate();
    const {
        profile,
        card,
        notifications,
        packages,
        transactions,
        loading,
        upgrading,
        renewing,
        error,
        qrData,
        handleUpgrade,
        handleRenew,
    } = useAuthPersonal();

    const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const isLibrarian = hasRole(user, ['ROLE_LIBRARIAN']);

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <ProfilePageHeader />

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12 }}>
                    <ProfileQuickActionsCard onNavigate={navigate} />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <ProfileInfoCard
                        profile={profile}
                        card={card}
                        qrData={qrData}
                        renewing={renewing}
                        onRenew={handleRenew}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <ProfileNotificationsCard notifications={notifications} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    {!isLibrarian && (
                        <MembershipPackagesCard
                            profile={profile}
                            packages={packages}
                            upgrading={upgrading}
                            onUpgrade={handleUpgrade}
                        />
                    )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                    {!isLibrarian && (
                        <MembershipTransactionsCard transactions={transactions} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
