import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function CategoryCrudSection() {
    const props = useLibrarianManagementContext();

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState('');

    const handleOpenCreate = () => {
        setEditingCategoryId(null);
        setCategoryName('');
        setFormOpen(true);
    };

    const handleOpenEdit = (id: number, name: string) => {
        setEditingCategoryId(id);
        setCategoryName(name);
        setFormOpen(true);
    };

    const handleSubmit = () => {
        const trimmed = categoryName.trim();
        if (!trimmed) {
            return;
        }

        if (editingCategoryId === null) {
            props.onCreateCategory(trimmed);
        } else {
            props.onUpdateCategory(editingCategoryId, trimmed);
        }

        setFormOpen(false);
        setEditingCategoryId(null);
        setCategoryName('');
    };

    const handleOpenDelete = (id: number) => {
        setDeletingCategoryId(id);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingCategoryId === null) {
            return;
        }
        props.onDeleteCategory(deletingCategoryId);
        setDeleteOpen(false);
        setDeletingCategoryId(null);
    };

    const deletingCategoryName = props.pagedCategories.find((item) => item.id === deletingCategoryId)?.name;

    return (
        <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Thể loại</Typography>
            <TextField
                size="small"
                fullWidth
                label="Tìm thể loại"
                value={props.categorySearch}
                onChange={(e) => props.onCategorySearchChange(e.target.value)}
                sx={{ mb: 1 }}
            />
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button variant="contained" onClick={handleOpenCreate}>Thêm thể loại</Button>
            </Stack>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tên thể loại</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.pagedCategories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">Chưa có dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        props.pagedCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => handleOpenEdit(category.id, category.name)}>Sửa</Button>
                                    <Button size="small" color="error" onClick={() => handleOpenDelete(category.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <LibrarianTablePagination
                count={props.filteredCategoriesCount}
                page={props.categoryPage}
                rowsPerPage={props.categoryRowsPerPage}
                onPageChange={props.onCategoryPageChange}
                onRowsPerPageChange={props.onCategoryRowsPerPageChange}
            />

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editingCategoryId === null ? 'Thêm thể loại' : 'Sửa thể loại'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên thể loại"
                        value={categoryName}
                        onChange={(event) => setCategoryName(event.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={!categoryName.trim()}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Xóa thể loại</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa thể loại{deletingCategoryName ? ` "${deletingCategoryName}"` : ''}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Hủy</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete}>Xóa</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
