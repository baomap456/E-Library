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

export default function AuthorCrudSection() {
    const props = useLibrarianManagementContext();

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null);
    const [deletingAuthorId, setDeletingAuthorId] = useState<number | null>(null);
    const [authorName, setAuthorName] = useState('');

    const handleOpenCreate = () => {
        setEditingAuthorId(null);
        setAuthorName('');
        setFormOpen(true);
    };

    const handleOpenEdit = (id: number, name: string) => {
        setEditingAuthorId(id);
        setAuthorName(name);
        setFormOpen(true);
    };

    const handleSubmit = () => {
        const trimmed = authorName.trim();
        if (!trimmed) {
            return;
        }

        if (editingAuthorId === null) {
            props.onCreateAuthor(trimmed);
        } else {
            props.onUpdateAuthor(editingAuthorId, trimmed);
        }

        setFormOpen(false);
        setEditingAuthorId(null);
        setAuthorName('');
    };

    const handleOpenDelete = (id: number) => {
        setDeletingAuthorId(id);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingAuthorId === null) {
            return;
        }
        props.onDeleteAuthor(deletingAuthorId);
        setDeleteOpen(false);
        setDeletingAuthorId(null);
    };

    const deletingAuthorName = props.pagedAuthors.find((item) => item.id === deletingAuthorId)?.name;

    return (
        <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Tác giả</Typography>
            <TextField
                size="small"
                fullWidth
                label="Tìm tác giả"
                value={props.authorSearch}
                onChange={(e) => props.onAuthorSearchChange(e.target.value)}
                sx={{ mb: 1 }}
            />
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button variant="contained" onClick={handleOpenCreate}>Thêm tác giả</Button>
            </Stack>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tên tác giả</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.pagedAuthors.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">Chưa có dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        props.pagedAuthors.map((author) => (
                            <TableRow key={author.id}>
                                <TableCell>{author.id}</TableCell>
                                <TableCell>{author.name}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => handleOpenEdit(author.id, author.name)}>Sửa</Button>
                                    <Button size="small" color="error" onClick={() => handleOpenDelete(author.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <LibrarianTablePagination
                count={props.filteredAuthorsCount}
                page={props.authorPage}
                rowsPerPage={props.authorRowsPerPage}
                onPageChange={props.onAuthorPageChange}
                onRowsPerPageChange={props.onAuthorRowsPerPageChange}
            />

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editingAuthorId === null ? 'Thêm tác giả' : 'Sửa tác giả'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên tác giả"
                        value={authorName}
                        onChange={(event) => setAuthorName(event.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={!authorName.trim()}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Xóa tác giả</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa tác giả{deletingAuthorName ? ` "${deletingAuthorName}"` : ''}?
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
