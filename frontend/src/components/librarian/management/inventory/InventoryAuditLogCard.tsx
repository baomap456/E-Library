import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import LibrarianTablePagination from '../../LibrarianTablePagination';
import type { ReportsAuditLog } from '../../../../types/modules/reports';

type Props = {
    auditLogs: ReportsAuditLog[];
};

export default function InventoryAuditLogCard({ auditLogs }: Readonly<Props>) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const pagedLogs = useMemo(() => {
        const start = page * rowsPerPage;
        return auditLogs.slice(start, start + rowsPerPage);
    }, [auditLogs, page, rowsPerPage]);

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
                <Typography variant="h6" sx={{ mb: 1.2 }}>Audit log thao tác quan trọng</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Actor</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Target</TableCell>
                            <TableCell>Chi tiết</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagedLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{String(log.createdAt).replace('T', ' ').slice(0, 19)}</TableCell>
                                <TableCell>{log.actor}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.targetType} #{log.targetId}</TableCell>
                                <TableCell>{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <LibrarianTablePagination
                    count={auditLogs.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[10, 20, 30]}
                />
            </CardContent>
        </Card>
    );
}
