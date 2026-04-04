import { Link as RouterLink } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
} from '@mui/material';
import HomeNavbar from '../../components/home/HomeNavbar';
import HomeBorrowSlipDialog from '../../components/home/HomeBorrowSlipDialog';
import BorrowQueueNoticeDialog from '../../components/borrowing/BorrowQueueNoticeDialog';
import BookDetailInfoCard from '../../components/catalog/BookDetailInfoCard';
import { useBookDetail } from '../../hooks/modules/useBookDetail';

export default function BookDetail() {
    const model = useBookDetail();

    if (model.loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #eef4ff 0%, #f7f9fd 44%, #ffffff 100%)' }}>
            <HomeNavbar showSearch={false} />

            <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
                {model.error && <Alert severity="warning" sx={{ mb: 2 }}>{model.error}</Alert>}
                {model.actionMessage && <Alert severity="info" sx={{ mb: 2 }}>{model.actionMessage}</Alert>}

                <Stack spacing={2.5}>
                    <Button component={RouterLink} to="/app/book-list" variant="text" sx={{ alignSelf: 'flex-start' }}>
                        ← Quay lại khám phá sách
                    </Button>

                    <BookDetailInfoCard
                        book={model.book}
                        detail={model.detail}
                        authors={model.authors}
                        onReserve={model.openBorrowSlip}
                        onJoinWaitlist={model.handleJoinWaitlist}
                        canReserve={!model.isStaff}
                        reserveDisabledMessage="Thủ thư không tự mượn"
                        canJoinWaitlist={!model.isStaff}
                        waitlistDisabledMessage="Thủ thư không vào hàng đợi"
                    />
                </Stack>
            </Box>

            <BorrowQueueNoticeDialog
                open={model.queueNoticeOpen}
                message={model.queueNoticeMessage}
                onClose={() => model.setQueueNoticeOpen(false)}
            />

            <HomeBorrowSlipDialog
                open={model.borrowDialogOpen}
                book={model.book}
                pickupDate={model.pickupDate}
                returnDate={model.returnDate}
                submitting={model.borrowSubmitting}
                error={model.borrowDialogError}
                onChangePickupDate={model.setPickupDate}
                onChangeReturnDate={model.setReturnDate}
                onClose={() => model.setBorrowDialogOpen(false)}
                onConfirm={() => { void model.confirmBorrowSlip(); }}
            />
        </Box>
    );
}
