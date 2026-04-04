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
        digitalDocuments,
        authors,
        categories,
        locations,
        borrowers,
        membershipPackages,
        barcode,
        setBarcode,
        username,
        setUsername,
        guestBorrowMode,
        setGuestBorrowMode,
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
        guestLoanType,
        setGuestLoanType,
        guestDepositAmount,
        setGuestDepositAmount,
        guestCitizenId,
        setGuestCitizenId,
        newUserUsername,
        setNewUserUsername,
        newUserPassword,
        setNewUserPassword,
        newUserEmail,
        setNewUserEmail,
        newUserFullName,
        setNewUserFullName,
        newUserStudentId,
        setNewUserStudentId,
        upgradeUsername,
        setUpgradeUsername,
        upgradeTargetPackage,
        setUpgradeTargetPackage,
        incident,
        setIncident,
        incidentRecordId,
        setIncidentRecordId,
        incidentType,
        setIncidentType,
        damageSeverity,
        setDamageSeverity,
        repairCost,
        setRepairCost,
        lostCompensationRate,
        setLostCompensationRate,
        newAuthor,
        setNewAuthor,
        digitalTitle,
        setDigitalTitle,
        digitalDescription,
        setDigitalDescription,
        digitalPublisher,
        setDigitalPublisher,
        digitalPublishYear,
        setDigitalPublishYear,
        digitalFileUrl,
        setDigitalFileUrl,
        digitalIsbn,
        setDigitalIsbn,
        debtPaymentRecordId,
        setDebtPaymentRecordId,
        debtPaymentAmount,
        setDebtPaymentAmount,
        newCategory,
        setNewCategory,
        newRoom,
        setNewRoom,
        newShelf,
        setNewShelf,
        loading,
        error,
        handleCheckout,
        handleGuestCheckout,
        handleCheckin,
        handleCreateUserDirect,
        handleUpgradeAccountDirect,
        handleIncident,
        handleReportBorrowIncident,
        handleCreateAuthor,
        handleCreateDigitalDocument,
        handleUpdateDigitalDocument,
        handleDeleteDigitalDocument,
        handlePartialDebtPayment,
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
        bookRowsPerPage,
        bookAvailableOnly,
        setBookAvailableOnly,
        filteredBooksCount,
        pagedBooks,
        debtorPage,
        debtorRowsPerPage,
        debtorOverdueOnly,
        setDebtorOverdueOnly,
        filteredDebtorsCount,
        pagedDebtors,
        requestPage,
        requestRowsPerPage,
        pagedRequests,
        authorSearch,
        setAuthorSearch,
        authorPage,
        authorRowsPerPage,
        filteredAuthors,
        pagedAuthors,
        categorySearch,
        setCategorySearch,
        categoryPage,
        categoryRowsPerPage,
        filteredCategories,
        pagedCategories,
        locationSearch,
        setLocationSearch,
        locationPage,
        locationRowsPerPage,
        filteredLocations,
        pagedLocations,
        onBookPageChange,
        onBookRowsPerPageChange,
        onDebtorPageChange,
        onDebtorRowsPerPageChange,
        onRequestPageChange,
        onRequestRowsPerPageChange,
        onAuthorPageChange,
        onAuthorRowsPerPageChange,
        onCategoryPageChange,
        onCategoryRowsPerPageChange,
        onLocationPageChange,
        onLocationRowsPerPageChange,
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

    const pendingLabel = pendingCount > 0 ? `Duyệt yêu cầu (${pendingCount})` : 'Duyệt yêu cầu';
    const membershipPackageOptions = membershipPackages.map((item) => item.name);

    const handleOpenApprove = (id: number) => {
        setSelectedRequest(id);
        setReviewAction('approve');
        setReviewNote('');
    };

    const handleOpenReject = (id: number) => {
        setSelectedRequest(id);
        setReviewAction('reject');
        setReviewNote('');
    };

    const circulationManagementProps = {
        username,
        borrowers,
        guestBorrowMode,
        guestName,
        guestPhone,
        guestLoanType,
        guestDepositAmount,
        guestCitizenId,
        barcode,
        onUsernameChange: setUsername,
        onGuestBorrowModeChange: setGuestBorrowMode,
        onGuestNameChange: setGuestName,
        onGuestPhoneChange: setGuestPhone,
        onGuestLoanTypeChange: setGuestLoanType,
        onGuestDepositAmountChange: setGuestDepositAmount,
        onGuestCitizenIdChange: setGuestCitizenId,
        onBarcodeChange: setBarcode,
        onCheckout: () => { void handleCheckout(); },
        onGuestCheckout: () => { void handleGuestCheckout(); },
        onCheckin: () => { void handleCheckin(); },
    };

    const accountManagementProps = {
        newUserUsername,
        newUserPassword,
        newUserEmail,
        newUserFullName,
        newUserStudentId,
        onNewUserUsernameChange: setNewUserUsername,
        onNewUserPasswordChange: setNewUserPassword,
        onNewUserEmailChange: setNewUserEmail,
        onNewUserFullNameChange: setNewUserFullName,
        onNewUserStudentIdChange: setNewUserStudentId,
        onCreateUserDirect: () => { void handleCreateUserDirect(); },
        upgradeUsername,
        upgradeTargetPackage,
        membershipPackageOptions,
        onUpgradeUsernameChange: setUpgradeUsername,
        onUpgradeTargetPackageChange: setUpgradeTargetPackage,
        onUpgradeAccountDirect: () => { void handleUpgradeAccountDirect(); },
    };

    const incidentManagementProps = {
        incident,
        incidentRecordId,
        incidentType,
        damageSeverity,
        repairCost,
        lostCompensationRate,
        onIncidentChange: setIncident,
        onIncidentRecordIdChange: setIncidentRecordId,
        onIncidentTypeChange: setIncidentType,
        onDamageSeverityChange: setDamageSeverity,
        onRepairCostChange: setRepairCost,
        onLostCompensationRateChange: setLostCompensationRate,
        onCreateIncident: () => { void handleIncident(); },
        onReportBorrowIncident: () => { void handleReportBorrowIncident(); },
    };

    const catalogManagementProps = {
        digitalDocuments,
        digitalTitle,
        digitalDescription,
        digitalPublisher,
        digitalPublishYear,
        digitalFileUrl,
        digitalIsbn,
        onDigitalTitleChange: setDigitalTitle,
        onDigitalDescriptionChange: setDigitalDescription,
        onDigitalPublisherChange: setDigitalPublisher,
        onDigitalPublishYearChange: setDigitalPublishYear,
        onDigitalFileUrlChange: setDigitalFileUrl,
        onDigitalIsbnChange: setDigitalIsbn,
        onCreateDigitalDocument: () => { void handleCreateDigitalDocument(); },
        onUpdateDigitalDocument: handleUpdateDigitalDocument,
        onDeleteDigitalDocument: handleDeleteDigitalDocument,
        authorSearch,
        onAuthorSearchChange: setAuthorSearch,
        newAuthor,
        onNewAuthorChange: setNewAuthor,
        onCreateAuthor: () => { void handleCreateAuthor(); },
        pagedAuthors,
        filteredAuthorsCount: filteredAuthors.length,
        authorPage,
        authorRowsPerPage,
        onAuthorPageChange,
        onAuthorRowsPerPageChange,
        onUpdateAuthor: handleUpdateAuthor,
        onDeleteAuthor: handleDeleteAuthor,
        categorySearch,
        onCategorySearchChange: setCategorySearch,
        newCategory,
        onNewCategoryChange: setNewCategory,
        onCreateCategory: () => { void handleCreateCategory(); },
        pagedCategories,
        filteredCategoriesCount: filteredCategories.length,
        categoryPage,
        categoryRowsPerPage,
        onCategoryPageChange,
        onCategoryRowsPerPageChange,
        onUpdateCategory: handleUpdateCategory,
        onDeleteCategory: handleDeleteCategory,
        locationSearch,
        onLocationSearchChange: setLocationSearch,
        newRoom,
        onNewRoomChange: setNewRoom,
        newShelf,
        onNewShelfChange: setNewShelf,
        onCreateLocation: () => { void handleCreateLocation(); },
        pagedLocations,
        filteredLocationsCount: filteredLocations.length,
        locationPage,
        locationRowsPerPage,
        onLocationPageChange,
        onLocationRowsPerPageChange,
        onUpdateLocation: handleUpdateLocation,
        onDeleteLocation: handleDeleteLocation,
    };

    const managementTabProps = {
        dashboard,
        allBooks: books,
        pagedBooks,
        booksCount: filteredBooksCount,
        bookAvailableOnly,
        onBookAvailableOnlyChange: setBookAvailableOnly,
        bookPage,
        bookRowsPerPage,
        onBookPageChange,
        onBookRowsPerPageChange,
        pagedDebtors,
        debtorsCount: filteredDebtorsCount,
        debtorOverdueOnly,
        onDebtorOverdueOnlyChange: setDebtorOverdueOnly,
        debtorPage,
        debtorRowsPerPage,
        debtPaymentRecordId,
        debtPaymentAmount,
        onDebtPaymentRecordIdChange: setDebtPaymentRecordId,
        onDebtPaymentAmountChange: setDebtPaymentAmount,
        onPartialDebtPayment: () => { void handlePartialDebtPayment(); },
        onDebtorPageChange,
        onDebtorRowsPerPageChange,
        ...circulationManagementProps,
        ...accountManagementProps,
        ...incidentManagementProps,
        ...catalogManagementProps,
    };

    const borrowRequestsTabProps = {
        loading: requestsLoading,
        requests,
        pendingCount,
        filterStatus,
        onFilterStatusChange: setFilterStatus,
        pagedRequests,
        requestPage,
        requestRowsPerPage,
        onRequestPageChange,
        onRequestRowsPerPageChange,
        onOpenApprove: handleOpenApprove,
        onOpenReject: handleOpenReject,
    };

    return (
        <Box>
            <LibrarianPageHeader />

            {(error || requestsError) && <Alert severity="warning" sx={{ mb: 2 }}>{error || requestsError}</Alert>}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
                    <Tab label="Quản lý mượn trả" />
                    <Tab label={pendingLabel} />
                </Tabs>
            </Box>

            {tabValue === 0 && <LibrarianManagementTab {...managementTabProps} />}

            {tabValue === 1 && <LibrarianBorrowRequestsTab {...borrowRequestsTabProps} />}

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
