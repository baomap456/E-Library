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
import IncidentReportSection from './management/IncidentReportSection';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianCategory,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianLocation,
} from '../../types/modules/librarian';
import LibrarianDashboardMetrics from './LibrarianDashboardMetrics';
import LocationCrudSection from './management/LocationCrudSection';

type OnPageChange = (_: unknown, page: number) => void;

type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface LibrarianManagementTabProps {
    dashboard: LibrarianDashboard | null;
    pagedBooks: LibrarianBook[];
    booksCount: number;
    bookPage: number;
    bookRowsPerPage: number;
    onBookPageChange: OnPageChange;
    onBookRowsPerPageChange: RowsPerPageChange;
    username: string;
    barcode: string;
    onUsernameChange: (value: string) => void;
    onBarcodeChange: (value: string) => void;
    onCheckout: () => void;
    onCheckin: () => void;

    incident: string;
    onIncidentChange: (value: string) => void;
    onCreateIncident: () => void;

    pagedDebtors: LibrarianDebtor[];
    debtorsCount: number;
    debtorPage: number;
    debtorRowsPerPage: number;
    onDebtorPageChange: OnPageChange;
    onDebtorRowsPerPageChange: RowsPerPageChange;

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

export default function LibrarianManagementTab(props: LibrarianManagementTabProps) {
    return (
        <Grid container spacing={2.2} sx={{ mt: 0.1 }}>
            <Grid size={{ xs: 12 }}>
                <LibrarianDashboardMetrics dashboard={props.dashboard} />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
                <BookCrudSection
                    books={props.pagedBooks}
                    totalCount={props.booksCount}
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
                    username={props.username}
                    barcode={props.barcode}
                    onUsernameChange={props.onUsernameChange}
                    onBarcodeChange={props.onBarcodeChange}
                    onCheckout={props.onCheckout}
                    onCheckin={props.onCheckin}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <DebtorFinesSection
                    debtors={props.pagedDebtors}
                    totalCount={props.debtorsCount}
                    page={props.debtorPage}
                    rowsPerPage={props.debtorRowsPerPage}
                    onPageChange={props.onDebtorPageChange}
                    onRowsPerPageChange={props.onDebtorRowsPerPageChange}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <IncidentReportSection
                    incident={props.incident}
                    onIncidentChange={props.onIncidentChange}
                    onCreateIncident={props.onCreateIncident}
                />
            </Grid>
        </Grid>
    );
}
