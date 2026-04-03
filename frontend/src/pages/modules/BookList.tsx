import { Alert, Box, CircularProgress, Grid } from '@mui/material';
import HomeNavbar from '../../components/home/HomeNavbar';
import HomeBorrowSlipDialog from '../../components/home/HomeBorrowSlipDialog';
import BorrowQueueNoticeDialog from '../../components/borrowing/BorrowQueueNoticeDialog';
import BookListHeroCard from '../../components/catalog/BookListHeroCard';
import BookListFiltersPanel from '../../components/catalog/BookListFiltersPanel';
import BookListResultsPanel from '../../components/catalog/BookListResultsPanel';
import { useBookList } from '../../hooks/modules/useBookList';

export default function BookList() {
    const model = useBookList();

    if (model.loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #eef4ff 0%, #f7f9fd 44%, #ffffff 100%)' }}>
            <HomeNavbar showSearch={false} />

            <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
                <BookListHeroCard
                    booksCount={model.books.length}
                    filteredCount={model.filteredBooks.length}
                    pendingCount={model.selectedBook?.pendingRequests ?? 0}
                />

                {model.error && <Alert severity="warning" sx={{ mb: 2 }}>{model.error}</Alert>}

                <Grid container spacing={2.5} alignItems="flex-start">
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <BookListFiltersPanel
                            search={model.search}
                            setSearch={model.setSearch}
                            categoryOptions={model.categoryOptions}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 8 }}>
                        <BookListResultsPanel
                            selectedBook={model.selectedBook}
                            previewBooks={model.previewBooks}
                            pagedBooks={model.pagedBooks}
                            booksPerPage={model.booksPerPage}
                            currentBookPage={model.currentBookPage}
                            totalBookPages={model.totalBookPages}
                            onSelectBook={model.setSelectedBookId}
                            onReserve={model.openBorrowSlip}
                            onJoinWaitlist={(bookId) => { void model.handleJoinWaitlist(bookId); }}
                            canReserve={!model.isStaff}
                            canJoinWaitlist={!model.isStaff}
                            onChangePage={model.setBookPage}
                        />
                    </Grid>
                </Grid>
            </Box>

            <BorrowQueueNoticeDialog
                open={model.queueNoticeOpen}
                message={model.queueNoticeMessage}
                onClose={() => model.setQueueNoticeOpen(false)}
            />

            <HomeBorrowSlipDialog
                open={model.borrowDialogOpen}
                book={model.selectedBorrowBook}
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
