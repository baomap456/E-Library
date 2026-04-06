import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import LibrarianTablePagination from '../../LibrarianTablePagination';
import type { ReportsDiscrepancy } from '../../../../types/modules/reports';

type Props = {
    discrepancies: ReportsDiscrepancy[];
};

export default function InventoryDiscrepancyCard({ discrepancies }: Readonly<Props>) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const pagedDiscrepancies = useMemo(() => {
        const start = page * rowsPerPage;
        return discrepancies.slice(start, start + rowsPerPage);
    }, [discrepancies, page, rowsPerPage]);

    const handlePageChange = (_: unknown, nextPage: number) => {
        setPage(nextPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Báo cáo chênh lệch</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sách</TableCell>
                            <TableCell align="right">Hệ thống</TableCell>
                            <TableCell align="right">Thực tế</TableCell>
                            <TableCell align="right">Chênh lệch</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagedDiscrepancies.map((row) => (
                            <TableRow key={row.title} sx={{ background: row.difference < 0 ? 'rgba(244,67,54,0.08)' : 'transparent' }}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">{row.systemCount}</TableCell>
                                <TableCell align="right">{row.actualCount}</TableCell>
                                <TableCell align="right">{row.difference}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <LibrarianTablePagination
                    count={discrepancies.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </CardContent>
        </Card>
    );
}
