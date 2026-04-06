import {
    Alert,
    Box,
    CircularProgress,
    Grid,
} from '@mui/material';
import BorrowRecordDetailDialog from '../../components/borrowing/BorrowRecordDetailDialog';
import BorrowingPageHeader from '../../components/borrowing/BorrowingPageHeader';
import BorrowingRecordsCard from '../../components/borrowing/BorrowingRecordsCard';
import { useBorrowingReservation } from '../../hooks/modules/useBorrowingReservation';
import { useMemo, useState } from 'react';
import type { BorrowingRecord } from '../../types/modules/borrowing';

export default function ReturnBooksPage() {
    const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);
    const {
        records,
        loading,
        renewingRecordId,
        error,
        hasOverdueRecords,
        handleRenew,
    } = useBorrowingReservation();

    const returningRecords = useMemo(
        () => records.filter((item) => !item.returnDate || item.status === 'OVERDUE'),
        [records],
    );

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

            {hasOverdueRecords && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Bạn đang có sách quá hạn! Vui lòng hoàn trả để tránh phát sinh thêm phí.
                </Alert>
            )}

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <BorrowingRecordsCard
                        records={returningRecords}
                        renewingRecordId={renewingRecordId}
                        onRenew={handleRenew}
                        onViewDetail={setSelectedRecord}
                    />
                </Grid>
            </Grid>

            <BorrowRecordDetailDialog
                open={selectedRecord !== null}
                record={selectedRecord}
                onClose={() => setSelectedRecord(null)}
            />
        </Box>
    );
}
