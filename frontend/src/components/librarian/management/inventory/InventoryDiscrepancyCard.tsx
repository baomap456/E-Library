import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { ReportsDiscrepancy } from '../../../../types/modules/reports';

type Props = {
    discrepancies: ReportsDiscrepancy[];
};

export default function InventoryDiscrepancyCard({ discrepancies }: Readonly<Props>) {
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
                        {discrepancies.map((row) => (
                            <TableRow key={row.title} sx={{ background: row.difference < 0 ? 'rgba(244,67,54,0.08)' : 'transparent' }}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">{row.systemCount}</TableCell>
                                <TableCell align="right">{row.actualCount}</TableCell>
                                <TableCell align="right">{row.difference}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
