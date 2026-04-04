import { Alert, Box, Container, CircularProgress } from '@mui/material';
import type { CatalogBookItem, CatalogHomeResponse } from '../../types/modules/catalog';
import HomeBooksSection from './HomeBooksSection';
import HomeFiltersCard from './HomeFiltersCard';
import HomeHeroSection from './HomeHeroSection';
import HomeHighlightsSection from './HomeHighlightsSection';
import HomeRefreshIndicator from './HomeRefreshIndicator';
import HomeBorrowSlipDialog from './HomeBorrowSlipDialog';
import HomeNavbar from './HomeNavbar';
import BorrowQueueNoticeDialog from '../borrowing/BorrowQueueNoticeDialog';
import type { HomeSearchState } from './types';

type FeedbackState = Readonly<{ severity: 'success' | 'info' | 'warning' | 'error'; message: string }>;

type Props = Readonly<{
    home: CatalogHomeResponse | null;
    loading: boolean;
    refreshing: boolean;
    error: string;
    feedback: FeedbackState | null;
    token: string | null;
    isStaff: boolean;
    search: HomeSearchState;
    onSearchChange: (field: keyof HomeSearchState, value: string) => void;
    categoryOptions: string[];
    authorOptions: string[];
    yearOptions: number[];
    bannerText: string;
    searchPlaceholder: string;
    latestBooksCount: number;
    popularBooksCount: number;
    filteredBooks: CatalogBookItem[];
    booksPerPage: number;
    bookPage: number;
    totalBookPages: number;
    pagedBooks: CatalogBookItem[];
    selectedBorrowBook: CatalogBookItem | null;
    borrowDialogOpen: boolean;
    borrowSubmitting: boolean;
    borrowDialogError: string;
    queueNoticeOpen: boolean;
    queueNoticeMessage: string;
    pickupDate: string;
    returnDate: string;
    primaryAction: { label: string; to: string };
    secondaryAction: { label: string; to: string };
    onBookPageChange: (page: number) => void;
    onSearchQueryChange: (value: string) => void;
    onBorrowSlipClose: () => void;
    onBorrowSlipConfirm: () => void;
    onBorrowDateChange: {
        pickup: (value: string) => void;
        return: (value: string) => void;
    };
    onQueueNoticeClose: () => void;
    onBorrow: (book: CatalogBookItem) => void;
    onWaitlist: (bookId: number) => void;
}>;

export default function HomePageContent({
    home,
    loading,
    refreshing,
    error,
    feedback,
    token,
    isStaff,
    search,
    onSearchChange,
    categoryOptions,
    authorOptions,
    yearOptions,
    bannerText,
    searchPlaceholder,
    latestBooksCount,
    popularBooksCount,
    filteredBooks,
    booksPerPage,
    bookPage,
    totalBookPages,
    pagedBooks,
    selectedBorrowBook,
    borrowDialogOpen,
    borrowSubmitting,
    borrowDialogError,
    queueNoticeOpen,
    queueNoticeMessage,
    pickupDate,
    returnDate,
    primaryAction,
    secondaryAction,
    onBookPageChange,
    onSearchQueryChange,
    onBorrowSlipClose,
    onBorrowSlipConfirm,
    onBorrowDateChange,
    onQueueNoticeClose,
    onBorrow,
    onWaitlist,
}: Props) {
    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #eef4ff 0%, #f7f9fd 42%, #ffffff 100%)' }}>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(circle at 10% 10%, rgba(16, 67, 159, 0.16), transparent 24%), radial-gradient(circle at 85% 0%, rgba(242, 123, 34, 0.18), transparent 22%), radial-gradient(circle at 85% 75%, rgba(83, 162, 255, 0.14), transparent 28%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 4, md: 7 } }}>
                    <HomeNavbar searchValue={search.q} onSearchChange={onSearchQueryChange} />
                    <HomeHeroSection
                        token={token}
                        isStaff={isStaff}
                        primaryAction={primaryAction}
                        secondaryAction={secondaryAction}
                        bannerText={bannerText}
                        searchPlaceholder={searchPlaceholder}
                        latestCount={latestBooksCount}
                        popularCount={popularBooksCount}
                        filteredCount={filteredBooks.length}
                    />
                </Container>
            </Box>

            {(error || feedback) && (
                <Container maxWidth="xl" sx={{ mt: 1 }}>
                    {error && <Alert severity="warning" sx={{ mb: feedback ? 1 : 0 }}>{error}</Alert>}
                    {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}
                </Container>
            )}

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <HomeHighlightsSection
                    latestBooks={home?.newArrivals ?? []}
                    popularBooks={home?.mostBorrowed ?? []}
                    primaryAction={primaryAction}
                    secondaryAction={secondaryAction}
                    token={token}
                />
            </Container>

            <Container maxWidth="xl" sx={{ pb: 6 }}>
                <HomeFiltersCard
                    search={search}
                    onChange={onSearchChange}
                    categoryOptions={categoryOptions}
                    authorOptions={authorOptions}
                    yearOptions={yearOptions}
                />

                {loading ? (
                    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <HomeBooksSection
                        books={pagedBooks}
                        bookPage={bookPage}
                        totalBookPages={totalBookPages}
                        showPagination={filteredBooks.length > booksPerPage}
                        isStaff={isStaff}
                        onChangePage={onBookPageChange}
                        onBorrow={onBorrow}
                        onWaitlist={onWaitlist}
                    />
                )}
            </Container>

            <HomeRefreshIndicator open={refreshing} />
            <BorrowQueueNoticeDialog
                open={queueNoticeOpen}
                message={queueNoticeMessage}
                onClose={onQueueNoticeClose}
            />
            <HomeBorrowSlipDialog
                open={borrowDialogOpen}
                book={selectedBorrowBook}
                pickupDate={pickupDate}
                returnDate={returnDate}
                submitting={borrowSubmitting}
                error={borrowDialogError}
                onChangePickupDate={onBorrowDateChange.pickup}
                onChangeReturnDate={onBorrowDateChange.return}
                onClose={onBorrowSlipClose}
                onConfirm={onBorrowSlipConfirm}
            />
        </Box>
    );
}