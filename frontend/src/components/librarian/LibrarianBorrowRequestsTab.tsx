import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { BorrowRequestResponse } from '../../types/borrowing';
import LibrarianTablePagination from './LibrarianTablePagination';

type OnPageChange = (_: unknown, page: number) => void;

type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface LibrarianBorrowRequestsTabProps {
    loading: boolean;
    requests: BorrowRequestResponse[];
    pendingCount: number;
    filterStatus: 'PENDING' | 'ALL';
    onFilterStatusChange: (status: 'PENDING' | 'ALL') => void;
    pagedRequests: BorrowRequestResponse[];
    requestPage: number;
    requestRowsPerPage: number;
    onRequestPageChange: OnPageChange;
    onRequestRowsPerPageChange: RowsPerPageChange;
    onOpenApprove: (id: number) => void;
    onOpenReject: (id: number) => void;
}

export default function LibrarianBorrowRequestsTab(props: LibrarianBorrowRequestsTabProps) {
    return (
        <Box sx={{ mt: 2 }}>
            {props.loading ? (
                <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Card>
                    <CardContent>
                        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                            <Button
                                variant={props.filterStatus === 'PENDING' ? 'contained' : 'outlined'}
                                onClick={() => props.onFilterStatusChange('PENDING')}
                            >
                                Đang chờ duyệt ({props.pendingCount})
                            </Button>
                            <Button
                                variant={props.filterStatus === 'ALL' ? 'contained' : 'outlined'}
                                onClick={() => props.onFilterStatusChange('ALL')}
                            >
                                Tất cả
                            </Button>
                        </Box>

                        {props.requests.length === 0 ? (
                            <Typography color="text.secondary">Không có yêu cầu nào</Typography>
                        ) : (
                            <>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ background: '#f5f5f5' }}>
                                            <TableCell>Người gửi</TableCell>
                                            <TableCell>Sách yêu cầu</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell>Ngày yêu cầu</TableCell>
                                            <TableCell>Ngày lấy sách</TableCell>
                                            <TableCell>Ngày trả dự kiến</TableCell>
                                            <TableCell>Ngày duyệt</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.pagedRequests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell>{req.userFullName || req.username || `User #${req.userId}`}</TableCell>
                                                <TableCell>{req.bookTitle || `Book #${req.bookId}`}</TableCell>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            background:
                                                                req.status === 'PENDING'
                                                                    ? '#fff3cd'
                                                                    : req.status === 'APPROVED'
                                                                        ? '#d4edda'
                                                                        : '#f8d7da',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {req.status === 'PENDING'
                                                            ? 'Chờ duyệt'
                                                            : req.status === 'APPROVED'
                                                                ? 'Đã duyệt'
                                                                : req.status === 'REJECTED'
                                                                    ? 'Bị từ chối'
                                                                    : 'Đã hủy'}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{new Date(req.requestDate).toLocaleDateString('vi-VN')}</TableCell>
                                                <TableCell>{req.requestedPickupDate ? new Date(req.requestedPickupDate).toLocaleDateString('vi-VN') : '-'}</TableCell>
                                                <TableCell>{req.requestedReturnDate ? new Date(req.requestedReturnDate).toLocaleDateString('vi-VN') : '-'}</TableCell>
                                                <TableCell>{req.approvalDate ? new Date(req.approvalDate).toLocaleDateString('vi-VN') : '-'}</TableCell>
                                                <TableCell align="center">
                                                    {req.status === 'PENDING' && (
                                                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                            <Button size="small" variant="contained" color="success" onClick={() => props.onOpenApprove(req.id)}>Duyệt</Button>
                                                            <Button size="small" variant="outlined" color="error" onClick={() => props.onOpenReject(req.id)}>Từ chối</Button>
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <LibrarianTablePagination
                                    count={props.requests.length}
                                    page={props.requestPage}
                                    rowsPerPage={props.requestRowsPerPage}
                                    onPageChange={props.onRequestPageChange}
                                    onRowsPerPageChange={props.onRequestRowsPerPageChange}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
