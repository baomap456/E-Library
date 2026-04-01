import { Card, CardContent, FormControlLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { LibrarianBook } from '../../../types/modules/librarian';
import LibrarianTablePagination from '../LibrarianTablePagination';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface BookCrudSectionProps {
    books: LibrarianBook[];
    totalCount: number;
    availableOnly: boolean;
    onAvailableOnlyChange: (checked: boolean) => void;
    page: number;
    rowsPerPage: number;
    onPageChange: OnPageChange;
    onRowsPerPageChange: RowsPerPageChange;
}

export default function BookCrudSection(props: Readonly<BookCrudSectionProps>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quan ly dau sach (CRUD)</Typography>
                <FormControlLabel
                    control={<Switch checked={props.availableOnly} onChange={(event) => props.onAvailableOnlyChange(event.target.checked)} />}
                    label="Chỉ hiện sách còn bản khả dụng"
                    sx={{ mb: 1 }}
                />
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ten sach</TableCell>
                            <TableCell>Nam</TableCell>
                            <TableCell>NXB</TableCell>
                            <TableCell>Bản sẵn có</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>{book.id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.publishYear}</TableCell>
                                <TableCell>{book.publisher}</TableCell>
                                <TableCell>{book.availableCopies}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <LibrarianTablePagination
                    count={props.totalCount}
                    page={props.page}
                    rowsPerPage={props.rowsPerPage}
                    onPageChange={props.onPageChange}
                    onRowsPerPageChange={props.onRowsPerPageChange}
                    rowsPerPageOptions={[5, 8, 10]}
                />
            </CardContent>
        </Card>
    );
}
