import { Button, Stack, TextField, Typography } from '@mui/material';
import type { LibrarianAuthor } from '../../../types/modules/librarian';
import LibrarianTablePagination from '../LibrarianTablePagination';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface AuthorCrudSectionProps {
    authorSearch: string;
    onAuthorSearchChange: (value: string) => void;
    newAuthor: string;
    onNewAuthorChange: (value: string) => void;
    onCreateAuthor: () => void;
    pagedAuthors: LibrarianAuthor[];
    filteredAuthorsCount: number;
    authorPage: number;
    authorRowsPerPage: number;
    onAuthorPageChange: OnPageChange;
    onAuthorRowsPerPageChange: RowsPerPageChange;
    onUpdateAuthor: (id: number, name: string) => void;
    onDeleteAuthor: (id: number) => void;
}

export default function AuthorCrudSection(props: AuthorCrudSectionProps) {
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
                <Button variant="contained" onClick={props.onCreateAuthor}>Them</Button>
            </Stack>
            {props.pagedAuthors.map((author) => (
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
                        Sua
                    </Button>
                    <Button size="small" color="error" onClick={() => props.onDeleteAuthor(author.id)}>Xoa</Button>
                </Stack>
            ))}
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
