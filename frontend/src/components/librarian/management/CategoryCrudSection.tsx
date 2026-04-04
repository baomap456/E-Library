import { Button, Stack, TextField, Typography } from '@mui/material';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function CategoryCrudSection() {
    const props = useLibrarianManagementContext();
    return (
        <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>The loai</Typography>
            <TextField
                size="small"
                fullWidth
                label="Tim the loai"
                value={props.categorySearch}
                onChange={(e) => props.onCategorySearchChange(e.target.value)}
                sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    label="Ten the loai"
                    value={props.newCategory}
                    onChange={(e) => props.onNewCategoryChange(e.target.value)}
                />
                <Button variant="contained" onClick={props.onCreateCategory}>Them</Button>
            </Stack>
            {props.pagedCategories.map((category) => (
                <Stack key={category.id} direction="row" spacing={1} sx={{ mb: 0.7 }}>
                    <Typography sx={{ flex: 1 }}>{category.name}</Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                            const next = window.prompt('Sua ten the loai', category.name);
                            if (next && next.trim()) {
                                props.onUpdateCategory(category.id, next.trim());
                            }
                        }}
                    >
                        Sua
                    </Button>
                    <Button size="small" color="error" onClick={() => props.onDeleteCategory(category.id)}>Xoa</Button>
                </Stack>
            ))}
            <LibrarianTablePagination
                count={props.filteredCategoriesCount}
                page={props.categoryPage}
                rowsPerPage={props.categoryRowsPerPage}
                onPageChange={props.onCategoryPageChange}
                onRowsPerPageChange={props.onCategoryRowsPerPageChange}
            />
        </>
    );
}
