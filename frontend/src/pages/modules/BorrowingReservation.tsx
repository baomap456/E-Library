import {
    Alert,
    Box,
    CircularProgress,
    Grid,
} from '@mui/material';
import { getStoredUser, hasRole } from '../../api/session';
import BorrowingBookSelectionCard from '../../components/borrowing/BorrowingBookSelectionCard';
import BorrowingCartCard from '../../components/borrowing/BorrowingCartCard';
import BorrowingFinesCard from '../../components/borrowing/BorrowingFinesCard';
import BorrowingPageHeader from '../../components/borrowing/BorrowingPageHeader';
import BorrowingRecordsCard from '../../components/borrowing/BorrowingRecordsCard';
import BorrowingRequestsCard from '../../components/borrowing/BorrowingRequestsCard';
import BorrowingWaitlistCard from '../../components/borrowing/BorrowingWaitlistCard';
import LibrarianBorrowingNotice from '../../components/borrowing/LibrarianBorrowingNotice';
import { useBorrowingReservation } from '../../hooks/modules/useBorrowingReservation';

export default function BorrowingReservation() {
    const {
        cart,
        records,
        fines,
        books,
        requestedPickupDate,
        setRequestedPickupDate,
        requestedReturnDate,
        setRequestedReturnDate,
        waitlist,
        myRequests,
        loading,
        renewingRecordId,
        error,
        hasOverdueRecords,
        reachedMembershipLimit,
        membershipLimitMessage,
        handleRenew,
        handleCreateBorrowRequest,
        handleJoinWaitlist,
        handleCancelWaitlist,
        handleCancelRequest,
    } = useBorrowingReservation();

    const waitlistedBookIds = new Set(waitlist.map((item) => item.bookId));

    const user = getStoredUser();
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
            <BorrowingPageHeader />

            {isLibrarian && <LibrarianBorrowingNotice />}

            {hasOverdueRecords && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Bạn đang có sách quá hạn! Vui lòng hoàn trả để tránh phát sinh thêm phí.
                </Alert>
            )}

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <BorrowingCartCard cart={cart} />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <BorrowingRecordsCard records={records} renewingRecordId={renewingRecordId} onRenew={handleRenew} />
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <BorrowingWaitlistCard waitlist={waitlist} onCancelReservation={handleCancelWaitlist} />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <BorrowingFinesCard fines={fines} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <BorrowingBookSelectionCard
                        books={books}
                        requestedPickupDate={requestedPickupDate}
                        onRequestedPickupDateChange={setRequestedPickupDate}
                        requestedReturnDate={requestedReturnDate}
                        onRequestedReturnDateChange={setRequestedReturnDate}
                        waitlistedBookIds={waitlistedBookIds}
                        reachedMembershipLimit={reachedMembershipLimit}
                        membershipLimitMessage={membershipLimitMessage}
                        canCreateBorrowRequest={!isLibrarian}
                        borrowRequestDisabledMessage="Thủ thư không thể lập phiếu mượn cho chính mình"
                        canJoinWaitlist={!isLibrarian}
                        waitlistDisabledMessage="Thủ thư không được tham gia hàng chờ"
                        onCreateRequest={handleCreateBorrowRequest}
                        onJoinWaitlist={handleJoinWaitlist}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <BorrowingRequestsCard myRequests={myRequests} onCancelRequest={handleCancelRequest} />
                </Grid>
            </Grid>
        </Box>
    );
}
