import {
    Alert,
    Box,
    CircularProgress,
} from '@mui/material';
import type { ComponentProps } from 'react';
import { Outlet } from 'react-router-dom';
import BorrowRequestReviewDialog from '../../../components/librarian/BorrowRequestReviewDialog';
import LibrarianBorrowRequestsTab from '../../../components/librarian/LibrarianBorrowRequestsTab';
import LibrarianManagementTab from '../../../components/librarian/LibrarianManagementTab';
import LibrarianPageHeader from '../../../components/librarian/LibrarianPageHeader';
import { useLibrarianPanel } from '../../../hooks/modules/useLibrarianPanel';
import { useBorrowRequestReview } from '../../../hooks/modules/useBorrowRequestReview';
import { useLibrarianPanelUiState } from '../../../hooks/modules/useLibrarianPanelUiState';
import { useInventoryReports } from '../../../hooks/modules/useInventoryReports';
import type { ReportsKpi } from '../../../types/modules/reports';

export default function LibrarianLayout() {
    const {
        dashboard,
        books,
        debtors,
        membershipInvoices,
        digitalDocuments,
        authors,
        categories,
        locations,
        borrowers,
        membershipPackages,
        fineInvoices,
        userFineSummaries,
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
        borrowDueDate,
        setBorrowDueDate,
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
        handleCreateBook,
        handleCreateDigitalDocument,
        handleDeleteBook,
        handleUpdateDigitalDocument,
        handleUpdateBook,
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
        requestTypeFilter,
        setRequestTypeFilter,
        sourceFilter,
        setSourceFilter,
        handleApprove,
        handleReject,
        loadRequests,
    } = useBorrowRequestReview();

    const { kpis } = useInventoryReports();

    const {
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
        debtorSearch,
        setDebtorSearch,
        filteredDebtorsCount,
        pagedDebtors,
        fineInvoices: uiFineInvoices,
        membershipInvoices: uiMembershipInvoices,
        userFineSummaries: uiUserFineSummaries,
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
        fineInvoices,
        membershipInvoices,
        userFineSummaries,
        requests,
        authors,
        categories,
        locations,
        filterStatus,
    });

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

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }
    const membershipPackageOptions = membershipPackages.map((item) => ({
        name: item.name,
        price: item.price || 0,
    }));

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
        borrowDueDate,
        onBorrowDueDateChange: setBorrowDueDate,
        onBarcodeChange: setBarcode,
        onCheckout: async () => {
            await handleCheckout();
            await loadRequests();
        },
        onGuestCheckout: async () => {
            await handleGuestCheckout();
            await loadRequests();
        },
        onCheckin: async () => handleCheckin(),
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

    // Calculate compensation amount based on selected record and ratio
    const selectedIncidentRecord = debtors.find((d) => String(d.recordId) === incidentRecordId);
    const selectedBook = selectedIncidentRecord ? books.find((b) => b.title === selectedIncidentRecord.bookTitle) : null;
    const compensationAmount = selectedBook && lostCompensationRate
        ? ((selectedBook.price || 0) * Number.parseInt(lostCompensationRate, 10)) / 100
        : 0;

    const incidentManagementProps = {
        incident,
        incidentRecordId,
        incidentRecordOptions: Array.from(
            new Map(
                debtors.map((item) => [
                    item.recordId,
                    {
                        recordId: item.recordId,
                        label: `#${item.recordId} - ${item.username} - ${item.bookTitle}`,
                        bookPrice: books.find((b) => b.title === item.bookTitle)?.price || 0,
                    },
                ]),
            ).values(),
        ),
        incidentType,
        damageSeverity,
        repairCost,
        lostCompensationRate,
        compensationAmount: incidentType === 'LOST' ? compensationAmount : 0,
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
        onCreateAuthor: (name?: string) => { void handleCreateAuthor(name); },
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
        onCreateCategory: (name?: string) => { void handleCreateCategory(name); },
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
        onCreateLocation: (roomName?: string, shelfNumber?: string) => { void handleCreateLocation(roomName, shelfNumber); },
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
        kpis,
        allBooks: books,
        allAuthors: authors,
        allCategories: categories,
        allLocations: locations,
        pagedBooks,
        booksCount: filteredBooksCount,
        bookAvailableOnly,
        onBookAvailableOnlyChange: setBookAvailableOnly,
        bookPage,
        bookRowsPerPage,
        onBookPageChange,
        onBookRowsPerPageChange,
        onCreateBook: (payload: {
            title: string;
            description: string;
            publishYear: number;
            publisher: string;
            price: number;
            coverImageUrl: string;
            digital: boolean;
            authorIds: number[];
            categoryId: number;
            locationId?: number | null;
        }) => { void handleCreateBook(payload); },
        onUpdateBook: (id: number, payload: {
            title: string;
            description: string;
            publishYear: number;
            publisher: string;
            price: number;
            coverImageUrl: string;
            digital: boolean;
            authorIds: number[];
            categoryId: number;
            locationId?: number | null;
        }) => { void handleUpdateBook(id, payload); },
        onDeleteBook: (id: number) => { void handleDeleteBook(id); },
        pagedDebtors,
        debtorsCount: filteredDebtorsCount,
        debtorOverdueOnly,
        onDebtorOverdueOnlyChange: setDebtorOverdueOnly,
        debtorSearch,
        onDebtorSearchChange: setDebtorSearch,
        fineInvoices: uiFineInvoices,
        membershipInvoices: uiMembershipInvoices,
        userFineSummaries: uiUserFineSummaries,
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
        requestTypeFilter,
        onRequestTypeFilterChange: setRequestTypeFilter,
        sourceFilter,
        onSourceFilterChange: setSourceFilter,
        pagedRequests,
        requestPage,
        requestRowsPerPage,
        onRequestPageChange,
        onRequestRowsPerPageChange,
        onOpenApprove: handleOpenApprove,
        onOpenReject: handleOpenReject,
    };

    const outletContext: LibrarianLayoutOutletContext = {
        managementTabProps,
        borrowRequestsTabProps,
    };

    return (
        <Box>
            <LibrarianPageHeader />

            {(error || requestsError) && <Alert severity="warning" sx={{ mb: 2 }}>{error || requestsError}</Alert>}

            <Outlet context={outletContext} />

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

export interface LibrarianLayoutOutletContext {
    managementTabProps: Omit<ComponentProps<typeof LibrarianManagementTab>, 'view'> & { kpis: ReportsKpi | null };
    borrowRequestsTabProps: ComponentProps<typeof LibrarianBorrowRequestsTab>;
}
