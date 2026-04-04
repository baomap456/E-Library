import { Button, Card, CardContent, FormControlLabel, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function BookCrudSection() {
    const props = useLibrarianManagementContext();

    const createPayloadFromPrompts = (seed?: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        price: number;
        coverImageUrl: string;
        digital: boolean;
    }) => {
        const title = globalThis.prompt('Tên sách', seed?.title || '');
        if (title === null || !title.trim()) {
            return null;
        }

        const description = globalThis.prompt('Mô tả', seed?.description || '');
        if (description === null) {
            return null;
        }

        const yearRaw = globalThis.prompt('Năm xuất bản', String(seed?.publishYear || new Date().getFullYear()));
        if (yearRaw === null) {
            return null;
        }
        const publishYear = Number.parseInt(yearRaw, 10);
        if (!Number.isFinite(publishYear) || publishYear <= 0) {
            return null;
        }

        const publisher = globalThis.prompt('Nhà xuất bản', seed?.publisher || '');
        if (publisher === null) {
            return null;
        }

        const priceRaw = globalThis.prompt('Giá sách', String(seed?.price ?? 0));
        if (priceRaw === null) {
            return null;
        }
        const price = Number.parseFloat(priceRaw);
        if (!Number.isFinite(price) || price < 0) {
            return null;
        }

        const coverImageUrl = globalThis.prompt('Cover image URL', seed?.coverImageUrl || '');
        if (coverImageUrl === null) {
            return null;
        }

        const digitalRaw = globalThis.prompt('Là tài liệu số? (yes/no)', seed?.digital ? 'yes' : 'no');
        if (digitalRaw === null) {
            return null;
        }

        return {
            title: title.trim(),
            description: description.trim(),
            publishYear,
            publisher: publisher.trim(),
            price,
            coverImageUrl: coverImageUrl.trim(),
            digital: ['yes', 'y', 'true', '1'].includes(digitalRaw.trim().toLowerCase()),
        };
    };

    const handleCreateBook = () => {
        const payload = createPayloadFromPrompts();
        if (!payload) {
            return;
        }
        props.onCreateBook(payload);
    };

    const handleEditBook = (book: {
        id: number;
        title: string;
        description?: string;
        publishYear: number;
        publisher: string;
        price?: number;
        coverImageUrl?: string;
        digital?: boolean;
    }) => {
        const payload = createPayloadFromPrompts({
            title: book.title,
            description: book.description || '',
            publishYear: book.publishYear,
            publisher: book.publisher || '',
            price: book.price ?? 0,
            coverImageUrl: book.coverImageUrl || '',
            digital: Boolean(book.digital),
        });
        if (!payload) {
            return;
        }
        props.onUpdateBook(book.id, payload);
    };

    const handleDeleteBook = (id: number) => {
        const ok = globalThis.confirm('Bạn có chắc muốn xoá sách này?');
        if (!ok) {
            return;
        }
        props.onDeleteBook(id);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quan ly dau sach (CRUD)</Typography>
                <FormControlLabel
                    control={<Switch checked={props.bookAvailableOnly} onChange={(event) => props.onBookAvailableOnlyChange(event.target.checked)} />}
                    label="Chỉ hiện sách còn bản khả dụng"
                    sx={{ mb: 1 }}
                />
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                    <Button variant="contained" onClick={handleCreateBook}>Add</Button>
                </Stack>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ten sach</TableCell>
                            <TableCell>Nam</TableCell>
                            <TableCell>NXB</TableCell>
                            <TableCell align="right">Giá</TableCell>
                            <TableCell>Bản sẵn có</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.pagedBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Chưa có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            props.pagedBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.publishYear}</TableCell>
                                    <TableCell>{book.publisher}</TableCell>
                                    <TableCell align="right">{(book.price ?? 0).toLocaleString('vi-VN')} VND</TableCell>
                                    <TableCell>{book.availableCopies}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" onClick={() => handleEditBook(book)}>Edit</Button>
                                        <Button size="small" color="error" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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
