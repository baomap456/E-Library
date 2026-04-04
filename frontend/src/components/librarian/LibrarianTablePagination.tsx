import { TablePagination } from '@mui/material';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface LibrarianTablePaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: OnPageChange;
    onRowsPerPageChange: RowsPerPageChange;
    rowsPerPageOptions?: number[];
}

export default function LibrarianTablePagination(props: LibrarianTablePaginationProps) {
    return (
        <TablePagination
            component="div"
            count={props.count}
            page={props.page}
            rowsPerPage={props.rowsPerPage}
            onPageChange={props.onPageChange}
            onRowsPerPageChange={props.onRowsPerPageChange}
            rowsPerPageOptions={props.rowsPerPageOptions ?? [5, 10, 20]}
            labelRowsPerPage="So dong"
        />
    );
}
