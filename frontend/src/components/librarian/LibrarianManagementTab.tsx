import {
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import AuthorCrudSection from './management/AuthorCrudSection';
import BookCrudSection from './management/BookCrudSection';
import CategoryCrudSection from './management/CategoryCrudSection';
import CirculationActionsSection from './management/CirculationActionsSection';
import DebtorFinesSection from './management/DebtorFinesSection';
import DigitalCrudSection from './management/DigitalCrudSection';
import IncidentReportSection from './management/IncidentReportSection';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianBorrowerOption,
    LibrarianCategory,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianDigitalDocument,
    LibrarianLocation,
} from '../../types/modules/librarian';
import LibrarianDashboardMetrics from './LibrarianDashboardMetrics';
import LocationCrudSection from './management/LocationCrudSection';

type OnPageChange = (_: unknown, page: number) => void;

type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface LibrarianManagementTabProps {
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
    incidentType: 'LOST' | 'DAMAGED';
    damageSeverity: 'LIGHT' | 'HEAVY';
    repairCost: string;
    lostCompensationRate: '100' | '150';
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

export default function LibrarianManagementTab(props: Readonly<LibrarianManagementTabProps>) {
    return (
        <Grid container spacing={2.2} sx={{ mt: 0.1 }}>
            <Grid size={{ xs: 12 }}>
                <LibrarianDashboardMetrics dashboard={props.dashboard} />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
                <BookCrudSection
                    books={props.pagedBooks}
                    totalCount={props.booksCount}
                    availableOnly={props.bookAvailableOnly}
                    onAvailableOnlyChange={props.onBookAvailableOnlyChange}
                    page={props.bookPage}
                    rowsPerPage={props.bookRowsPerPage}
                    onPageChange={props.onBookPageChange}
                    onRowsPerPageChange={props.onBookRowsPerPageChange}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.2 }}>CRUD dữ liệu thư mục</Typography>
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <AuthorCrudSection
                                    authorSearch={props.authorSearch}
                                    onAuthorSearchChange={props.onAuthorSearchChange}
                                    newAuthor={props.newAuthor}
                                    onNewAuthorChange={props.onNewAuthorChange}
                                    onCreateAuthor={props.onCreateAuthor}
                                    pagedAuthors={props.pagedAuthors}
                                    filteredAuthorsCount={props.filteredAuthorsCount}
                                    authorPage={props.authorPage}
                                    authorRowsPerPage={props.authorRowsPerPage}
                                    onAuthorPageChange={props.onAuthorPageChange}
                                    onAuthorRowsPerPageChange={props.onAuthorRowsPerPageChange}
                                    onUpdateAuthor={props.onUpdateAuthor}
                                    onDeleteAuthor={props.onDeleteAuthor}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <CategoryCrudSection
                                    categorySearch={props.categorySearch}
                                    onCategorySearchChange={props.onCategorySearchChange}
                                    newCategory={props.newCategory}
                                    onNewCategoryChange={props.onNewCategoryChange}
                                    onCreateCategory={props.onCreateCategory}
                                    pagedCategories={props.pagedCategories}
                                    filteredCategoriesCount={props.filteredCategoriesCount}
                                    categoryPage={props.categoryPage}
                                    categoryRowsPerPage={props.categoryRowsPerPage}
                                    onCategoryPageChange={props.onCategoryPageChange}
                                    onCategoryRowsPerPageChange={props.onCategoryRowsPerPageChange}
                                    onUpdateCategory={props.onUpdateCategory}
                                    onDeleteCategory={props.onDeleteCategory}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <LocationCrudSection
                                    locationSearch={props.locationSearch}
                                    onLocationSearchChange={props.onLocationSearchChange}
                                    newRoom={props.newRoom}
                                    onNewRoomChange={props.onNewRoomChange}
                                    newShelf={props.newShelf}
                                    onNewShelfChange={props.onNewShelfChange}
                                    onCreateLocation={props.onCreateLocation}
                                    pagedLocations={props.pagedLocations}
                                    filteredLocationsCount={props.filteredLocationsCount}
                                    locationPage={props.locationPage}
                                    locationRowsPerPage={props.locationRowsPerPage}
                                    onLocationPageChange={props.onLocationPageChange}
                                    onLocationRowsPerPageChange={props.onLocationRowsPerPageChange}
                                    onUpdateLocation={props.onUpdateLocation}
                                    onDeleteLocation={props.onDeleteLocation}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <CirculationActionsSection
                    books={props.allBooks}
                    username={props.username}
                    borrowers={props.borrowers}
                    guestBorrowMode={props.guestBorrowMode}
                    guestName={props.guestName}
                    guestPhone={props.guestPhone}
                    guestLoanType={props.guestLoanType}
                    guestDepositAmount={props.guestDepositAmount}
                    guestCitizenId={props.guestCitizenId}
                    barcode={props.barcode}
                    onUsernameChange={props.onUsernameChange}
                    onGuestBorrowModeChange={props.onGuestBorrowModeChange}
                    onGuestNameChange={props.onGuestNameChange}
                    onGuestPhoneChange={props.onGuestPhoneChange}
                    onGuestLoanTypeChange={props.onGuestLoanTypeChange}
                    onGuestDepositAmountChange={props.onGuestDepositAmountChange}
                    onGuestCitizenIdChange={props.onGuestCitizenIdChange}
                    onBarcodeChange={props.onBarcodeChange}
                    onCheckout={props.onCheckout}
                    onGuestCheckout={props.onGuestCheckout}
                    onCheckin={props.onCheckin}
                    newUserUsername={props.newUserUsername}
                    newUserPassword={props.newUserPassword}
                    newUserEmail={props.newUserEmail}
                    newUserFullName={props.newUserFullName}
                    newUserStudentId={props.newUserStudentId}
                    onNewUserUsernameChange={props.onNewUserUsernameChange}
                    onNewUserPasswordChange={props.onNewUserPasswordChange}
                    onNewUserEmailChange={props.onNewUserEmailChange}
                    onNewUserFullNameChange={props.onNewUserFullNameChange}
                    onNewUserStudentIdChange={props.onNewUserStudentIdChange}
                    onCreateUserDirect={props.onCreateUserDirect}
                    upgradeUsername={props.upgradeUsername}
                    upgradeTargetPackage={props.upgradeTargetPackage}
                    membershipPackageOptions={props.membershipPackageOptions}
                    onUpgradeUsernameChange={props.onUpgradeUsernameChange}
                    onUpgradeTargetPackageChange={props.onUpgradeTargetPackageChange}
                    onUpgradeAccountDirect={props.onUpgradeAccountDirect}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <DebtorFinesSection
                    debtors={props.pagedDebtors}
                    totalCount={props.debtorsCount}
                    overdueOnly={props.debtorOverdueOnly}
                    onOverdueOnlyChange={props.onDebtorOverdueOnlyChange}
                    page={props.debtorPage}
                    rowsPerPage={props.debtorRowsPerPage}
                    onPageChange={props.onDebtorPageChange}
                    onRowsPerPageChange={props.onDebtorRowsPerPageChange}
                    debtPaymentRecordId={props.debtPaymentRecordId}
                    debtPaymentAmount={props.debtPaymentAmount}
                    onDebtPaymentRecordIdChange={props.onDebtPaymentRecordIdChange}
                    onDebtPaymentAmountChange={props.onDebtPaymentAmountChange}
                    onPartialDebtPayment={props.onPartialDebtPayment}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <IncidentReportSection
                    incident={props.incident}
                    incidentRecordId={props.incidentRecordId}
                    incidentType={props.incidentType}
                    damageSeverity={props.damageSeverity}
                    repairCost={props.repairCost}
                    lostCompensationRate={props.lostCompensationRate}
                    onIncidentChange={props.onIncidentChange}
                    onIncidentRecordIdChange={props.onIncidentRecordIdChange}
                    onIncidentTypeChange={props.onIncidentTypeChange}
                    onDamageSeverityChange={props.onDamageSeverityChange}
                    onRepairCostChange={props.onRepairCostChange}
                    onLostCompensationRateChange={props.onLostCompensationRateChange}
                    onCreateIncident={props.onCreateIncident}
                    onReportBorrowIncident={props.onReportBorrowIncident}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <DigitalCrudSection
                    documents={props.digitalDocuments}
                    title={props.digitalTitle}
                    description={props.digitalDescription}
                    publisher={props.digitalPublisher}
                    publishYear={props.digitalPublishYear}
                    fileUrl={props.digitalFileUrl}
                    isbn={props.digitalIsbn}
                    onTitleChange={props.onDigitalTitleChange}
                    onDescriptionChange={props.onDigitalDescriptionChange}
                    onPublisherChange={props.onDigitalPublisherChange}
                    onPublishYearChange={props.onDigitalPublishYearChange}
                    onFileUrlChange={props.onDigitalFileUrlChange}
                    onIsbnChange={props.onDigitalIsbnChange}
                    onCreate={props.onCreateDigitalDocument}
                    onUpdate={props.onUpdateDigitalDocument}
                    onDelete={props.onDeleteDigitalDocument}
                />
            </Grid>
        </Grid>
    );
}
