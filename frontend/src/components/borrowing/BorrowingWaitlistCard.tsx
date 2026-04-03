import {
    Button,
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

type Props = Readonly<{
    waitlist: BorrowingWaitlistItem[];
    onCancelReservation?: (reservationId: number) => Promise<void>;
}>;

export default function BorrowingWaitlistCard({ waitlist, onCancelReservation }: Props) {
    const showActions = Boolean(onCancelReservation);
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Sách đang chờ của tôi</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên sách</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Vị trí chờ</TableCell>
                            <TableCell align="right">Hạn nhận</TableCell>
                            {showActions && <TableCell align="right">Thao tác</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {waitlist.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={showActions ? 5 : 4}>Bạn chưa tham gia hàng chờ nào.</TableCell>
                            </TableRow>
                        )}
                        {waitlist.map((item) => (
                            <TableRow key={item.reservationId}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.status === 'NOTIFIED' ? 'Đã thông báo nhận' : 'Đang chờ'}</TableCell>
                                <TableCell align="right">#{item.position}</TableCell>
                                <TableCell align="right">
                                    {item.expiryDate ? new Date(item.expiryDate).toLocaleString() : '-'}
                                </TableCell>
                                {showActions && (
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => void onCancelReservation?.(item.reservationId)}
                                        >
                                            Hủy đặt
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
