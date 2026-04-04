import { Button, Stack, TextField, Typography } from '@mui/material';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function LocationCrudSection() {
    const props = useLibrarianManagementContext();
    return (
        <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Vi tri ke</Typography>
            <TextField
                size="small"
                fullWidth
                label="Tim vi tri"
                value={props.locationSearch}
                onChange={(e) => props.onLocationSearchChange(e.target.value)}
                sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                    size="small"
                    label="Phong"
                    value={props.newRoom}
                    onChange={(e) => props.onNewRoomChange(e.target.value)}
                />
                <TextField
                    size="small"
                    label="Ke"
                    value={props.newShelf}
                    onChange={(e) => props.onNewShelfChange(e.target.value)}
                />
                <Button variant="contained" onClick={props.onCreateLocation}>Add</Button>
            </Stack>
            {props.pagedLocations.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 1 }}>Chưa có dữ liệu</Typography>
            ) : (
                props.pagedLocations.map((location) => (
                    <Stack key={location.id} direction="row" spacing={1} sx={{ mb: 0.7 }}>
                        <Typography sx={{ flex: 1 }}>{location.roomName} - {location.shelfNumber}</Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                const room = window.prompt('Sua phong', location.roomName);
                                const shelf = window.prompt('Sua ke', location.shelfNumber);
                                if (room && room.trim() && shelf && shelf.trim()) {
                                    props.onUpdateLocation(location.id, room.trim(), shelf.trim());
                                }
                            }}
                        >
                            Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => props.onDeleteLocation(location.id)}>Delete</Button>
                    </Stack>
                ))
            )}
            <LibrarianTablePagination
                count={props.filteredLocationsCount}
                page={props.locationPage}
                rowsPerPage={props.locationRowsPerPage}
                onPageChange={props.onLocationPageChange}
                onRowsPerPageChange={props.onLocationRowsPerPageChange}
            />
        </>
    );
}
