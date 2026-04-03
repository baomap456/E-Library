import {
    Button,
    Card,
    CardContent,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { BorrowingFinesResponse } from '../../types/modules/borrowing';

type Props = {
    fines: BorrowingFinesResponse | null;
    showPayButton?: boolean;
};

export default function BorrowingFinesCard({ fines, showPayButton = true }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Lịch sử nợ phí</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID giao dịch</TableCell>
                            <TableCell>Ngày thanh toán</TableCell>
                            <TableCell align="right">Số tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(fines?.paidHistory || []).map((row) => (
                            <TableRow key={row.paymentId}>
                                <TableCell>{row.paymentId}</TableCell>
                                <TableCell>{String(row.paidAt || '').slice(0, 10)}</TableCell>
                                <TableCell align="right">{(row.amount || 0).toLocaleString('vi-VN')} VND</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Divider sx={{ my: 1.3 }} />
                <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    Tổng nợ: {(fines?.totalDebt || 0).toLocaleString('vi-VN')} VND
                </Typography>
                {showPayButton && (
                    <Button variant="contained" disabled={(fines?.unpaidCount || 0) === 0}>Thanh toán online</Button>
                )}
            </CardContent>
        </Card>
    );
}
