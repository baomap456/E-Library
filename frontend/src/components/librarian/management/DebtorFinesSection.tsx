import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { LibrarianDebtor } from '../../../types/modules/librarian';
import LibrarianTablePagination from '../LibrarianTablePagination';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface DebtorFinesSectionProps {
    debtors: LibrarianDebtor[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: OnPageChange;
    onRowsPerPageChange: RowsPerPageChange;
}

export default function DebtorFinesSection(props: DebtorFinesSectionProps) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quan ly phi phat</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Reader</TableCell>
                            <TableCell>Sach</TableCell>
                            <TableCell align="right">Phi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.debtors.map((debtor) => (
                            <TableRow key={debtor.recordId}>
                                <TableCell>{debtor.username}</TableCell>
                                <TableCell>{debtor.bookTitle}</TableCell>
                                <TableCell align="right">{(debtor.fineAmount || 0).toLocaleString('vi-VN')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <LibrarianTablePagination
                    count={props.totalCount}
                    page={props.page}
                    rowsPerPage={props.rowsPerPage}
                    onPageChange={props.onPageChange}
                    onRowsPerPageChange={props.onRowsPerPageChange}
                />
            </CardContent>
        </Card>
    );
}
