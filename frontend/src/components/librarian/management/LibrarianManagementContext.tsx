import { createContext, useContext } from 'react';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianBorrowerOption,
    LibrarianCategory,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianDigitalDocument,
    LibrarianLocation,
} from '../../../types/modules/librarian';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export interface LibrarianManagementContextValue {
    dashboard: LibrarianDashboard | null;
    allBooks: LibrarianBook[];
    pagedBooks: LibrarianBook[];
    booksCount: number;
    bookAvailableOnly: boolean;
    onBookAvailableOnlyChange: (checked: boolean) => void;
    bookPage: number;
    bookRowsPerPage: number;
    onBookPageChange: OnPageChange;
    onBookRowsPerPageChange: RowsPerPageChange;
    onCreateBook: (payload: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        price: number;
        coverImageUrl: string;
        digital: boolean;
    }) => void;
    onUpdateBook: (id: number, payload: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        price: number;
        coverImageUrl: string;
        digital: boolean;
    }) => void;
    onDeleteBook: (id: number) => void;
    username: string;
    borrowers: LibrarianBorrowerOption[];
    guestBorrowMode: boolean;
    guestName: string;
    guestPhone: string;
    guestLoanType: 'TAKE_HOME' | 'READ_ON_SITE';
    guestDepositAmount: string;
    guestCitizenId: string;
    barcode: string;
    onUsernameChange: (value: string) => void;
    onGuestBorrowModeChange: (value: boolean) => void;
    onGuestNameChange: (value: string) => void;
    onGuestPhoneChange: (value: string) => void;
    onGuestLoanTypeChange: (value: 'TAKE_HOME' | 'READ_ON_SITE') => void;
    onGuestDepositAmountChange: (value: string) => void;
    onGuestCitizenIdChange: (value: string) => void;
    onBarcodeChange: (value: string) => void;
    onCheckout: () => void;
    onGuestCheckout: () => void;
    onCheckin: () => void;
    newUserUsername: string;
    newUserPassword: string;
    newUserEmail: string;
    newUserFullName: string;
    newUserStudentId: string;
    onNewUserUsernameChange: (value: string) => void;
    onNewUserPasswordChange: (value: string) => void;
    onNewUserEmailChange: (value: string) => void;
    onNewUserFullNameChange: (value: string) => void;
    onNewUserStudentIdChange: (value: string) => void;
    onCreateUserDirect: () => void;
    upgradeUsername: string;
    upgradeTargetPackage: string;
    membershipPackageOptions: string[];
    onUpgradeUsernameChange: (value: string) => void;
    onUpgradeTargetPackageChange: (value: string) => void;
    onUpgradeAccountDirect: () => void;
    incident: string;
    incidentRecordId: string;
    incidentRecordOptions: Array<{
        recordId: number;
        label: string;
        bookPrice: number;
    }>;
    incidentType: 'LOST' | 'DAMAGED';
    damageSeverity: 'LIGHT' | 'HEAVY';
    repairCost: string;
    lostCompensationRate: '100' | '150';
    compensationAmount: number;
    onIncidentChange: (value: string) => void;
    onIncidentRecordIdChange: (value: string) => void;
    onIncidentTypeChange: (value: 'LOST' | 'DAMAGED') => void;
    onDamageSeverityChange: (value: 'LIGHT' | 'HEAVY') => void;
    onRepairCostChange: (value: string) => void;
    onLostCompensationRateChange: (value: '100' | '150') => void;
    onCreateIncident: () => void;
    onReportBorrowIncident: () => void;
    pagedDebtors: LibrarianDebtor[];
    debtorsCount: number;
    debtorOverdueOnly: boolean;
    onDebtorOverdueOnlyChange: (checked: boolean) => void;
    debtorPage: number;
    debtorRowsPerPage: number;
    onDebtorPageChange: OnPageChange;
    onDebtorRowsPerPageChange: RowsPerPageChange;
    debtPaymentRecordId: string;
    debtPaymentAmount: string;
    onDebtPaymentRecordIdChange: (value: string) => void;
    onDebtPaymentAmountChange: (value: string) => void;
    onPartialDebtPayment: () => void;
    digitalDocuments: LibrarianDigitalDocument[];
    digitalTitle: string;
    digitalDescription: string;
    digitalPublisher: string;
    digitalPublishYear: string;
    digitalFileUrl: string;
    digitalIsbn: string;
    onDigitalTitleChange: (value: string) => void;
    onDigitalDescriptionChange: (value: string) => void;
    onDigitalPublisherChange: (value: string) => void;
    onDigitalPublishYearChange: (value: string) => void;
    onDigitalFileUrlChange: (value: string) => void;
    onDigitalIsbnChange: (value: string) => void;
    onCreateDigitalDocument: () => void;
    onUpdateDigitalDocument: (id: number, payload: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        fileUrl: string;
        isbn: string;
    }) => void;
    onDeleteDigitalDocument: (id: number) => void;
    authorSearch: string;
    onAuthorSearchChange: (value: string) => void;
    newAuthor: string;
    onNewAuthorChange: (value: string) => void;
    onCreateAuthor: () => void;
    pagedAuthors: LibrarianAuthor[];
    filteredAuthorsCount: number;
    authorPage: number;
    authorRowsPerPage: number;
    onAuthorPageChange: OnPageChange;
    onAuthorRowsPerPageChange: RowsPerPageChange;
    onUpdateAuthor: (id: number, name: string) => void;
    onDeleteAuthor: (id: number) => void;
    categorySearch: string;
    onCategorySearchChange: (value: string) => void;
    newCategory: string;
    onNewCategoryChange: (value: string) => void;
    onCreateCategory: () => void;
    pagedCategories: LibrarianCategory[];
    filteredCategoriesCount: number;
    categoryPage: number;
    categoryRowsPerPage: number;
    onCategoryPageChange: OnPageChange;
    onCategoryRowsPerPageChange: RowsPerPageChange;
    onUpdateCategory: (id: number, name: string) => void;
    onDeleteCategory: (id: number) => void;
    locationSearch: string;
    onLocationSearchChange: (value: string) => void;
    newRoom: string;
    onNewRoomChange: (value: string) => void;
    newShelf: string;
    onNewShelfChange: (value: string) => void;
    onCreateLocation: () => void;
    pagedLocations: LibrarianLocation[];
    filteredLocationsCount: number;
    locationPage: number;
    locationRowsPerPage: number;
    onLocationPageChange: OnPageChange;
    onLocationRowsPerPageChange: RowsPerPageChange;
    onUpdateLocation: (id: number, roomName: string, shelfNumber: string) => void;
    onDeleteLocation: (id: number) => void;
}

const LibrarianManagementContext = createContext<LibrarianManagementContextValue | null>(null);

export function LibrarianManagementProvider({ value, children }: { value: LibrarianManagementContextValue; children: React.ReactNode }) {
    return <LibrarianManagementContext.Provider value={value}>{children}</LibrarianManagementContext.Provider>;
}

export function useLibrarianManagementContext() {
    const context = useContext(LibrarianManagementContext);
    if (!context) {
        throw new Error('useLibrarianManagementContext must be used within LibrarianManagementProvider');
    }
    return context;
}