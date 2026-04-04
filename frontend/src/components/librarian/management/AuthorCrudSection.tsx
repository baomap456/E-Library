import { Button, Stack, TextField, Typography } from '@mui/material';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function AuthorCrudSection() {
    const props = useLibrarianManagementContext();
    return (
        <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Tac gia</Typography>
            <TextField
                size="small"
                fullWidth
                label="Tim tac gia"
                value={props.authorSearch}
                onChange={(e) => props.onAuthorSearchChange(e.target.value)}
                sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    label="Ten tac gia"
                    value={props.newAuthor}
                    onChange={(e) => props.onNewAuthorChange(e.target.value)}
                />
                <Button variant="contained" onClick={props.onCreateAuthor}>Add</Button>
            </Stack>
            {props.pagedAuthors.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 1 }}>Chưa có dữ liệu</Typography>
            ) : (
                props.pagedAuthors.map((author) => (
                    <Stack key={author.id} direction="row" spacing={1} sx={{ mb: 0.7 }}>
                        <Typography sx={{ flex: 1 }}>{author.name}</Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                const next = window.prompt('Sua ten tac gia', author.name);
                                if (next && next.trim()) {
                                    props.onUpdateAuthor(author.id, next.trim());
                                }
                            }}
                        >
                            Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => props.onDeleteAuthor(author.id)}>Delete</Button>
                    </Stack>
                ))
            )}
            <LibrarianTablePagination
                count={props.filteredAuthorsCount}
                page={props.authorPage}
                rowsPerPage={props.authorRowsPerPage}
                onPageChange={props.onAuthorPageChange}
                onRowsPerPageChange={props.onAuthorRowsPerPageChange}
            />
        </>
    );
}
