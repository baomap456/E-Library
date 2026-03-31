import { Button, Stack, TextField, Typography } from '@mui/material';
import type { LibrarianLocation } from '../../../types/modules/librarian';
import LibrarianTablePagination from '../LibrarianTablePagination';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface LocationCrudSectionProps {
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

export default function LocationCrudSection(props: LocationCrudSectionProps) {
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
                <Button variant="contained" onClick={props.onCreateLocation}>Them</Button>
            </Stack>
            {props.pagedLocations.map((location) => (
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
                        Sua
                    </Button>
                    <Button size="small" color="error" onClick={() => props.onDeleteLocation(location.id)}>Xoa</Button>
                </Stack>
            ))}
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
