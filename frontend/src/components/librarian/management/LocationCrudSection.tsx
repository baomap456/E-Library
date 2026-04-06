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

export default function LocationCrudSection() {
    const props = useLibrarianManagementContext();

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
    const [deletingLocationId, setDeletingLocationId] = useState<number | null>(null);
    const [roomName, setRoomName] = useState('');
    const [shelfNumber, setShelfNumber] = useState('');

    const handleOpenCreate = () => {
        setEditingLocationId(null);
        setRoomName('');
        setShelfNumber('');
        setFormOpen(true);
    };

    const handleOpenEdit = (id: number, room: string, shelf: string) => {
        setEditingLocationId(id);
        setRoomName(room);
        setShelfNumber(shelf);
        setFormOpen(true);
    };

    const handleSubmit = () => {
        const room = roomName.trim();
        const shelf = shelfNumber.trim();
        if (!room || !shelf) {
            return;
        }

        if (editingLocationId === null) {
            props.onCreateLocation(room, shelf);
        } else {
            props.onUpdateLocation(editingLocationId, room, shelf);
        }

        setFormOpen(false);
        setEditingLocationId(null);
        setRoomName('');
        setShelfNumber('');
    };

    const handleOpenDelete = (id: number) => {
        setDeletingLocationId(id);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingLocationId === null) {
            return;
        }
        props.onDeleteLocation(deletingLocationId);
        setDeleteOpen(false);
        setDeletingLocationId(null);
    };

    const deletingLocation = props.pagedLocations.find((item) => item.id === deletingLocationId);

    return (
        <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Vị trí kệ</Typography>
            <TextField
                size="small"
                fullWidth
                label="Tìm vị trí"
                value={props.locationSearch}
                onChange={(e) => props.onLocationSearchChange(e.target.value)}
                sx={{ mb: 1 }}
            />
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button variant="contained" onClick={handleOpenCreate}>Thêm vị trí</Button>
            </Stack>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Phòng</TableCell>
                        <TableCell>Kệ</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.pagedLocations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">Chưa có dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        props.pagedLocations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell>{location.id}</TableCell>
                                <TableCell>{location.roomName}</TableCell>
                                <TableCell>{location.shelfNumber}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        onClick={() => handleOpenEdit(location.id, location.roomName, location.shelfNumber)}
                                    >
                                        Sửa
                                    </Button>
                                    <Button size="small" color="error" onClick={() => handleOpenDelete(location.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <LibrarianTablePagination
                count={props.filteredLocationsCount}
                page={props.locationPage}
                rowsPerPage={props.locationRowsPerPage}
                onPageChange={props.onLocationPageChange}
                onRowsPerPageChange={props.onLocationRowsPerPageChange}
            />

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editingLocationId === null ? 'Thêm vị trí sách' : 'Sửa vị trí sách'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={1.2} sx={{ mt: 0.2 }}>
                        <TextField
                            autoFocus
                            label="Phòng"
                            value={roomName}
                            onChange={(event) => setRoomName(event.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Kệ"
                            value={shelfNumber}
                            onChange={(event) => setShelfNumber(event.target.value)}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={!roomName.trim() || !shelfNumber.trim()}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Xóa vị trí</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa vị trí
                        {deletingLocation ? ` ${deletingLocation.roomName} - ${deletingLocation.shelfNumber}` : ''}?
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
