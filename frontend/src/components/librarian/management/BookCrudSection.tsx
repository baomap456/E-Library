import { Card, CardContent, FormControlLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function BookCrudSection() {
    const props = useLibrarianManagementContext();
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quan ly dau sach (CRUD)</Typography>
                <FormControlLabel
                    control={<Switch checked={props.bookAvailableOnly} onChange={(event) => props.onBookAvailableOnlyChange(event.target.checked)} />}
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
                        {props.pagedBooks.map((book) => (
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
                    count={props.booksCount}
                    page={props.bookPage}
                    rowsPerPage={props.bookRowsPerPage}
                    onPageChange={props.onBookPageChange}
                    onRowsPerPageChange={props.onBookRowsPerPageChange}
                    rowsPerPageOptions={[5, 8, 10]}
                />
            </CardContent>
        </Card>
    );
}
