import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useMemo, useState } from 'react';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

type BookFormState = {
    title: string;
    description: string;
    publishYear: string;
    publisher: string;
    price: string;
    coverImageUrl: string;
    digital: boolean;
    authorIds: number[];
    categoryId: string;
    locationId: string;
};

const createInitialBookForm = (seed?: {
    title?: string;
    description?: string;
    publishYear?: number;
    publisher?: string;
    price?: number;
    coverImageUrl?: string;
    digital?: boolean;
    authorIds?: number[];
    categoryId?: number | null;
    locationId?: number | null;
}): BookFormState => ({
    title: seed?.title ?? '',
    description: seed?.description ?? '',
    publishYear: String(seed?.publishYear ?? new Date().getFullYear()),
    publisher: seed?.publisher ?? '',
    price: String(seed?.price ?? 0),
    coverImageUrl: seed?.coverImageUrl ?? '',
    digital: Boolean(seed?.digital),
    authorIds: seed?.authorIds ?? [],
    categoryId: seed?.categoryId != null ? String(seed.categoryId) : '',
    locationId: seed?.locationId != null ? String(seed.locationId) : '',
});

export default function BookCrudSection() {
    const props = useLibrarianManagementContext();
    const [bookFormOpen, setBookFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState<number | null>(null);
    const [deletingBookId, setDeletingBookId] = useState<number | null>(null);
    const [formState, setFormState] = useState<BookFormState>(createInitialBookForm());

    const isEditing = editingBookId !== null;
    const selectedDeleteBook = useMemo(
        () => props.pagedBooks.find((book) => book.id === deletingBookId) ?? null,
        [deletingBookId, props.pagedBooks],
    );

    const handleFormClose = () => {
        setBookFormOpen(false);
        setEditingBookId(null);
        setFormState(createInitialBookForm());
    };

    const handleCreateBook = () => {
        setEditingBookId(null);
        setFormState(createInitialBookForm());
        setBookFormOpen(true);
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
        authorIds?: number[];
        categoryId?: number | null;
        locationId?: number | null;
    }) => {
        setEditingBookId(book.id);
        setFormState(
            createInitialBookForm({
                title: book.title,
                description: book.description || '',
                publishYear: book.publishYear,
                publisher: book.publisher,
                price: book.price ?? 0,
                coverImageUrl: book.coverImageUrl ?? '',
                digital: Boolean(book.digital),
                authorIds: book.authorIds ?? [],
                categoryId: book.categoryId ?? null,
                locationId: book.locationId ?? null,
            }),
        );
        setBookFormOpen(true);
    };

    const handleFormSubmit = () => {
        const publishYear = Number.parseInt(formState.publishYear, 10);
        const price = Number.parseFloat(formState.price);
        const categoryId = Number.parseInt(formState.categoryId, 10);
        const locationId = formState.locationId ? Number.parseInt(formState.locationId, 10) : null;
        const payload = {
            title: formState.title.trim(),
            description: formState.description.trim(),
            publishYear,
            publisher: formState.publisher.trim(),
            price,
            coverImageUrl: formState.coverImageUrl.trim(),
            digital: formState.digital,
            authorIds: formState.authorIds,
            categoryId,
            locationId,
        };

        if (
            !payload.title
            || !Number.isFinite(payload.publishYear)
            || payload.publishYear <= 0
            || !Number.isFinite(payload.price)
            || payload.price < 0
            || payload.authorIds.length === 0
            || !Number.isFinite(payload.categoryId)
            || payload.categoryId <= 0
            || (!payload.digital && (!Number.isFinite(payload.locationId ?? NaN) || (payload.locationId ?? 0) <= 0))
        ) {
            return;
        }

        if (isEditing && editingBookId !== null) {
            props.onUpdateBook(editingBookId, payload);
        } else {
            props.onCreateBook(payload);
        }
        handleFormClose();
    };

    const handleOpenDeleteDialog = (id: number) => {
        setDeletingBookId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteBook = () => {
        if (deletingBookId === null) {
            return;
        }
        props.onDeleteBook(deletingBookId);
        setDeleteDialogOpen(false);
        setDeletingBookId(null);
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
        setDeletingBookId(null);
    };

    const isFormValid =
        formState.title.trim().length > 0
        && Number.isFinite(Number.parseInt(formState.publishYear, 10))
        && Number.parseInt(formState.publishYear, 10) > 0
        && Number.isFinite(Number.parseFloat(formState.price))
        && Number.parseFloat(formState.price) >= 0
        && formState.authorIds.length > 0
        && Number.isFinite(Number.parseInt(formState.categoryId, 10))
        && Number.parseInt(formState.categoryId, 10) > 0
        && (formState.digital || (Number.isFinite(Number.parseInt(formState.locationId, 10)) && Number.parseInt(formState.locationId, 10) > 0));

    const handleAuthorsChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value;
        const nextAuthorIds = typeof value === 'string'
            ? value.split(',').map((part) => Number.parseInt(part, 10)).filter(Number.isFinite)
            : value.map((item) => Number(item));
        setFormState((prev) => ({ ...prev, authorIds: nextAuthorIds }));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quản lý sách</Typography>
                <FormControlLabel
                    control={<Switch checked={props.bookAvailableOnly} onChange={(event) => props.onBookAvailableOnlyChange(event.target.checked)} />}
                    label="Chỉ hiện sách còn bản khả dụng"
                    sx={{ mb: 1 }}
                />
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                    <Button variant="contained" onClick={handleCreateBook}>Thêm sách</Button>
                </Stack>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên sách</TableCell>
                            <TableCell>Tác giả</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Vị trí</TableCell>
                            <TableCell>Năm</TableCell>
                            <TableCell align="right">Giá</TableCell>
                            <TableCell>Bản sẵn có</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.pagedBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">Chưa có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            props.pagedBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.authorNames?.join(', ') || '-'}</TableCell>
                                    <TableCell>{book.categoryName || '-'}</TableCell>
                                    <TableCell>{book.locationLabel || '-'}</TableCell>
                                    <TableCell>{book.publishYear}</TableCell>
                                    <TableCell align="right">{(book.price ?? 0).toLocaleString('vi-VN')} VND</TableCell>
                                    <TableCell>{book.availableCopies}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" onClick={() => handleEditBook(book)}>Sửa</Button>
                                        <Button size="small" color="error" onClick={() => handleOpenDeleteDialog(book.id)}>Xóa</Button>
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

                <Dialog open={bookFormOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
                    <DialogTitle>{isEditing ? 'Sửa sách' : 'Thêm sách'}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={1.4} sx={{ mt: 0.3 }}>
                            <TextField
                                label="Tên sách"
                                value={formState.title}
                                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Mô tả"
                                value={formState.description}
                                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                                fullWidth
                                multiline
                                minRows={2}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Tác giả</InputLabel>
                                <Select
                                    multiple
                                    value={formState.authorIds}
                                    onChange={handleAuthorsChange}
                                    label="Tác giả"
                                    renderValue={(selected) => {
                                        const ids = selected as number[];
                                        return ids
                                            .map((id) => props.allAuthors.find((author) => author.id === id)?.name)
                                            .filter(Boolean)
                                            .join(', ');
                                    }}
                                >
                                    {props.allAuthors.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            <Checkbox checked={formState.authorIds.includes(author.id)} />
                                            <ListItemText primary={author.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    value={formState.categoryId}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: String(event.target.value) }))}
                                    label="Danh mục"
                                >
                                    {props.allCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                                <TextField
                                    label="Năm xuất bản"
                                    value={formState.publishYear}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, publishYear: event.target.value }))}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Giá"
                                    value={formState.price}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                                    required
                                    fullWidth
                                />
                            </Stack>
                            <TextField
                                label="Nhà xuất bản"
                                value={formState.publisher}
                                onChange={(event) => setFormState((prev) => ({ ...prev, publisher: event.target.value }))}
                                fullWidth
                            />
                            {!formState.digital && (
                                <FormControl fullWidth>
                                    <InputLabel>Vị trí sách</InputLabel>
                                    <Select
                                        value={formState.locationId}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, locationId: String(event.target.value) }))}
                                        label="Vị trí sách"
                                    >
                                        {props.allLocations.map((location) => (
                                            <MenuItem key={location.id} value={location.id}>
                                                {location.roomName} - Kệ {location.shelfNumber}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <TextField
                                label="Cover image URL"
                                value={formState.coverImageUrl}
                                onChange={(event) => setFormState((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                                fullWidth
                            />
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={formState.digital}
                                        onChange={(event) => setFormState((prev) => ({
                                            ...prev,
                                            digital: event.target.checked,
                                            locationId: event.target.checked ? '' : prev.locationId,
                                        }))}
                                    />
                                )}
                                label="Tài liệu số"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFormClose}>Hủy</Button>
                        <Button onClick={handleFormSubmit} variant="contained" disabled={!isFormValid}>
                            {isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
                    <DialogTitle>Xóa sách</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn xóa sách{selectedDeleteBook ? ` "${selectedDeleteBook.title}"` : ''}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteClose}>Hủy</Button>
                        <Button color="error" variant="contained" onClick={handleDeleteBook}>Xóa</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}
