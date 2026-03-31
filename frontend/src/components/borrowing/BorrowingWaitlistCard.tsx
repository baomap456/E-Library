import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { BorrowingWaitlistItem } from '../../types/modules/borrowing';

type Props = {
    waitlist: BorrowingWaitlistItem[];
};

export default function BorrowingWaitlistCard({ waitlist }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Sách đang chờ của tôi</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên sách</TableCell>
                            <TableCell align="right">Vị trí chờ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {waitlist.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2}>Bạn chưa tham gia hàng chờ nào.</TableCell>
                            </TableRow>
                        )}
                        {waitlist.map((item) => (
                            <TableRow key={item.bookId}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell align="right">#{item.position}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
