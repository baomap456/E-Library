import {
    Button,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { BorrowingRecord } from '../../types/modules/borrowing';

type Props = {
    records: BorrowingRecord[];
    onRenew: (recordId: number) => Promise<void>;
};

export default function BorrowingRecordsCard({ records, onRenew }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quản lý mượn trả (Cá nhân)</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sách</TableCell>
                            <TableCell>Hạn trả</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((row) => {
                            const isBorrowing = !row.returnDate;
                            return (
                                <TableRow key={row.recordId}>
                                    <TableCell>{row.bookTitle}</TableCell>
                                    <TableCell>{String(row.dueDate || '').slice(0, 10)}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={isBorrowing ? 'Đang mượn' : 'Đã trả'} color={isBorrowing ? 'primary' : 'default'} />
                                    </TableCell>
                                    <TableCell align="right">
                                        {isBorrowing ? <Button variant="text" size="small" onClick={() => void onRenew(row.recordId)}>Gia hạn</Button> : '-'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
