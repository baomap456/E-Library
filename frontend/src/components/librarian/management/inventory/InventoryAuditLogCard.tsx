import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { ReportsAuditLog } from '../../../../types/modules/reports';

type Props = {
    auditLogs: ReportsAuditLog[];
};

export default function InventoryAuditLogCard({ auditLogs }: Readonly<Props>) {
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
                        {auditLogs.slice(0, 30).map((log) => (
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
            </CardContent>
        </Card>
    );
}
