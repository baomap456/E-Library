import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { MembershipTransactionResponse } from '../../types/modules/authPersonal';

type Props = {
    transactions: MembershipTransactionResponse[];
};

export default function MembershipTransactionsCard({ transactions }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                    Lịch sử giao dịch thành viên
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.6 }}>
                    Cả người dùng và thủ thư đều có thể theo dõi các giao dịch nâng cấp, gia hạn, hoặc tự hạ cấp do hết hạn.
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Người thực hiện</TableCell>
                            <TableCell>Hành động</TableCell>
                            <TableCell>Chuyển gói</TableCell>
                            <TableCell align="right">Số tiền</TableCell>
                            <TableCell>Ghi chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6}>Chưa có giao dịch membership.</TableCell>
                            </TableRow>
                        )}
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{String(tx.createdAt).slice(0, 19).replace('T', ' ')}</TableCell>
                                <TableCell>{tx.actorUsername}</TableCell>
                                <TableCell>{tx.action}</TableCell>
                                <TableCell>{`${tx.fromPackage || '-'} -> ${tx.toPackage || '-'}`}</TableCell>
                                <TableCell align="right">{(tx.amount || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell>{tx.note || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
