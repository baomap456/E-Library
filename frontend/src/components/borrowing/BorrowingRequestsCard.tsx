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
import type { BorrowRequestResponse } from '../../types/borrowing';

type Props = {
    myRequests: BorrowRequestResponse[];
    onCancelRequest?: (requestId: number) => Promise<void>;
};

export default function BorrowingRequestsCard({ myRequests, onCancelRequest }: Props) {
    const showActions = Boolean(onCancelRequest);
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Phiếu của tôi</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Loại phiếu</TableCell>
                            <TableCell>Sách</TableCell>
                            <TableCell>Mã phiếu mượn</TableCell>
                            <TableCell>Ngày gửi</TableCell>
                            <TableCell>Ngày lấy sách</TableCell>
                            <TableCell>Ngày trả dự kiến</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            {showActions && <TableCell align="right">Hành động</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myRequests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.id}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        color={request.requestType === 'RENEWAL' ? 'info' : 'default'}
                                        label={request.requestType === 'RENEWAL' ? 'Gia hạn' : 'Mượn sách'}
                                    />
                                </TableCell>
                                <TableCell>{request.bookTitle || `Sách #${request.bookId ?? '-'}`}</TableCell>
                                <TableCell>{request.borrowRecordId ? `#${request.borrowRecordId}` : '-'}</TableCell>
                                <TableCell>{String(request.requestDate).slice(0, 10)}</TableCell>
                                <TableCell>{request.requestedPickupDate ? String(request.requestedPickupDate).slice(0, 10) : '-'}</TableCell>
                                <TableCell>{request.requestedReturnDate ? String(request.requestedReturnDate).slice(0, 10) : '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={request.status}
                                        color={
                                            request.status === 'APPROVED'
                                                ? 'success'
                                                : request.status === 'REJECTED'
                                                    ? 'error'
                                                    : request.status === 'CANCELLED'
                                                        ? 'default'
                                                        : 'warning'
                                        }
                                    />
                                </TableCell>
                                {showActions && (
                                    <TableCell align="right">
                                        {request.status === 'PENDING' ? (
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => void onCancelRequest?.(request.id)}
                                            >
                                                Hủy phiếu
                                            </Button>
                                        ) : '-'}
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
