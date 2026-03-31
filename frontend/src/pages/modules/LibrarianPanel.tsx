import {
    Alert,
    Box,
    CircularProgress,
    Tab,
    Tabs,
} from '@mui/material';
import BorrowRequestReviewDialog from '../../components/librarian/BorrowRequestReviewDialog';
import LibrarianBorrowRequestsTab from '../../components/librarian/LibrarianBorrowRequestsTab';
import LibrarianManagementTab from '../../components/librarian/LibrarianManagementTab';
import LibrarianPageHeader from '../../components/librarian/LibrarianPageHeader';
import { useLibrarianPanel } from '../../hooks/modules/useLibrarianPanel';
import { useBorrowRequestReview } from '../../hooks/modules/useBorrowRequestReview';
import { useLibrarianPanelUiState } from '../../hooks/modules/useLibrarianPanelUiState';

export default function LibrarianPanel() {

    const {
        dashboard,
        books,
        debtors,
        authors,
        categories,
        locations,
        barcode,
        setBarcode,
        username,
        setUsername,
        incident,
        setIncident,
        newAuthor,
        setNewAuthor,
        newCategory,
        setNewCategory,
        newRoom,
        setNewRoom,
        newShelf,
        setNewShelf,
        loading,
        error,
        handleCheckout,
        handleCheckin,
        handleIncident,
        handleCreateAuthor,
        handleUpdateAuthor,
        handleDeleteAuthor,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleCreateLocation,
        handleUpdateLocation,
        handleDeleteLocation,
    } = useLibrarianPanel();

    const {
        requests,
        pendingCount,
        loading: requestsLoading,
        error: requestsError,
        filterStatus,
        setFilterStatus,
        handleApprove,
        handleReject,
    } = useBorrowRequestReview();

    const {
        tabValue,
        setTabValue,
        selectedRequest,
        setSelectedRequest,
        reviewNote,
        setReviewNote,
        reviewAction,
        setReviewAction,
        bookPage,
        setBookPage,
        bookRowsPerPage,
        setBookRowsPerPage,
        pagedBooks,
        debtorPage,
        setDebtorPage,
        debtorRowsPerPage,
        setDebtorRowsPerPage,
        pagedDebtors,
        requestPage,
        setRequestPage,
        requestRowsPerPage,
        setRequestRowsPerPage,
        pagedRequests,
        authorSearch,
        setAuthorSearch,
        authorPage,
        setAuthorPage,
        authorRowsPerPage,
        setAuthorRowsPerPage,
        filteredAuthors,
        pagedAuthors,
        categorySearch,
        setCategorySearch,
        categoryPage,
        setCategoryPage,
        categoryRowsPerPage,
        setCategoryRowsPerPage,
        filteredCategories,
        pagedCategories,
        locationSearch,
        setLocationSearch,
        locationPage,
        setLocationPage,
        locationRowsPerPage,
        setLocationRowsPerPage,
        filteredLocations,
        pagedLocations,
    } = useLibrarianPanelUiState({
        books,
        debtors,
        requests,
        authors,
        categories,
        locations,
        filterStatus,
    });

    if (loading && tabValue !== 1) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleReviewSubmit = async () => {
        if (selectedRequest) {
            if (reviewAction === 'approve') {
                await handleApprove(selectedRequest, reviewNote);
            } else {
                await handleReject(selectedRequest, reviewNote);
            }
            setSelectedRequest(null);
            setReviewNote('');
        }
    };

    return (
        <Box>
            <LibrarianPageHeader />

            {(error || requestsError) && <Alert severity="warning" sx={{ mb: 2 }}>{error || requestsError}</Alert>}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
                    <Tab label="Quản lý mượn trả" />
                    <Tab label={`Duyệt yêu cầu${pendingCount > 0 ? ` (${pendingCount})` : ''}`} />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <LibrarianManagementTab
                    dashboard={dashboard}
                    pagedBooks={pagedBooks}
                    booksCount={books.length}
                    bookPage={bookPage}
                    bookRowsPerPage={bookRowsPerPage}
                    onBookPageChange={(_, nextPage) => setBookPage(nextPage)}
                    onBookRowsPerPageChange={(event) => {
                        setBookRowsPerPage(parseInt(event.target.value, 10));
                        setBookPage(0);
                    }}
                    username={username}
                    barcode={barcode}
                    onUsernameChange={setUsername}
                    onBarcodeChange={setBarcode}
                    onCheckout={() => void handleCheckout()}
                    onCheckin={() => void handleCheckin()}
                    incident={incident}
                    onIncidentChange={setIncident}
                    onCreateIncident={() => void handleIncident()}
                    pagedDebtors={pagedDebtors}
                    debtorsCount={debtors.length}
                    debtorPage={debtorPage}
                    debtorRowsPerPage={debtorRowsPerPage}
                    onDebtorPageChange={(_, nextPage) => setDebtorPage(nextPage)}
                    onDebtorRowsPerPageChange={(event) => {
                        setDebtorRowsPerPage(parseInt(event.target.value, 10));
                        setDebtorPage(0);
                    }}
                    authorSearch={authorSearch}
                    onAuthorSearchChange={setAuthorSearch}
                    newAuthor={newAuthor}
                    onNewAuthorChange={setNewAuthor}
                    onCreateAuthor={() => void handleCreateAuthor()}
                    pagedAuthors={pagedAuthors}
                    filteredAuthorsCount={filteredAuthors.length}
                    authorPage={authorPage}
                    authorRowsPerPage={authorRowsPerPage}
                    onAuthorPageChange={(_, nextPage) => setAuthorPage(nextPage)}
                    onAuthorRowsPerPageChange={(event) => {
                        setAuthorRowsPerPage(parseInt(event.target.value, 10));
                        setAuthorPage(0);
                    }}
                    onUpdateAuthor={(id, name) => void handleUpdateAuthor(id, name)}
                    onDeleteAuthor={(id) => void handleDeleteAuthor(id)}
                    categorySearch={categorySearch}
                    onCategorySearchChange={setCategorySearch}
                    newCategory={newCategory}
                    onNewCategoryChange={setNewCategory}
                    onCreateCategory={() => void handleCreateCategory()}
                    pagedCategories={pagedCategories}
                    filteredCategoriesCount={filteredCategories.length}
                    categoryPage={categoryPage}
                    categoryRowsPerPage={categoryRowsPerPage}
                    onCategoryPageChange={(_, nextPage) => setCategoryPage(nextPage)}
                    onCategoryRowsPerPageChange={(event) => {
                        setCategoryRowsPerPage(parseInt(event.target.value, 10));
                        setCategoryPage(0);
                    }}
                    onUpdateCategory={(id, name) => void handleUpdateCategory(id, name)}
                    onDeleteCategory={(id) => void handleDeleteCategory(id)}
                    locationSearch={locationSearch}
                    onLocationSearchChange={setLocationSearch}
                    newRoom={newRoom}
                    onNewRoomChange={setNewRoom}
                    newShelf={newShelf}
                    onNewShelfChange={setNewShelf}
                    onCreateLocation={() => void handleCreateLocation()}
                    pagedLocations={pagedLocations}
                    filteredLocationsCount={filteredLocations.length}
                    locationPage={locationPage}
                    locationRowsPerPage={locationRowsPerPage}
                    onLocationPageChange={(_, nextPage) => setLocationPage(nextPage)}
                    onLocationRowsPerPageChange={(event) => {
                        setLocationRowsPerPage(parseInt(event.target.value, 10));
                        setLocationPage(0);
                    }}
                    onUpdateLocation={(id, roomName, shelfNumber) => void handleUpdateLocation(id, roomName, shelfNumber)}
                    onDeleteLocation={(id) => void handleDeleteLocation(id)}
                />
            )}

            {tabValue === 1 && (
                <LibrarianBorrowRequestsTab
                    loading={requestsLoading}
                    requests={requests}
                    pendingCount={pendingCount}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    pagedRequests={pagedRequests}
                    requestPage={requestPage}
                    requestRowsPerPage={requestRowsPerPage}
                    onRequestPageChange={(_, nextPage) => setRequestPage(nextPage)}
                    onRequestRowsPerPageChange={(event) => {
                        setRequestRowsPerPage(parseInt(event.target.value, 10));
                        setRequestPage(0);
                    }}
                    onOpenApprove={(id) => {
                        setSelectedRequest(id);
                        setReviewAction('approve');
                        setReviewNote('');
                    }}
                    onOpenReject={(id) => {
                        setSelectedRequest(id);
                        setReviewAction('reject');
                        setReviewNote('');
                    }}
                />
            )}

            <BorrowRequestReviewDialog
                open={selectedRequest !== null}
                action={reviewAction}
                note={reviewNote}
                onChangeNote={setReviewNote}
                onClose={() => setSelectedRequest(null)}
                onSubmit={handleReviewSubmit}
            />
        </Box>
    );
}
