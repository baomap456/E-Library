import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
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
    requestTypeFilter: 'ALL' | 'BORROW' | 'RENEWAL';
    onRequestTypeFilterChange: (type: 'ALL' | 'BORROW' | 'RENEWAL') => void;
    sourceFilter: 'ALL' | 'REQUEST' | 'DESK';
    onSourceFilterChange: (source: 'ALL' | 'REQUEST' | 'DESK') => void;
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

                        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                variant={props.requestTypeFilter === 'ALL' ? 'contained' : 'outlined'}
                                onClick={() => props.onRequestTypeFilterChange('ALL')}
                                size="small"
                            >
                                Tất cả loại phiếu
                            </Button>
                            <Button
                                variant={props.requestTypeFilter === 'BORROW' ? 'contained' : 'outlined'}
                                onClick={() => props.onRequestTypeFilterChange('BORROW')}
                                size="small"
                            >
                                Phiếu mượn
                            </Button>
                            <Button
                                variant={props.requestTypeFilter === 'RENEWAL' ? 'contained' : 'outlined'}
                                onClick={() => props.onRequestTypeFilterChange('RENEWAL')}
                                size="small"
                            >
                                Phiếu gia hạn
                            </Button>
                        </Box>

                        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                variant={props.sourceFilter === 'ALL' ? 'contained' : 'outlined'}
                                onClick={() => props.onSourceFilterChange('ALL')}
                                size="small"
                            >
                                Tất cả nguồn
                            </Button>
                            <Button
                                variant={props.sourceFilter === 'REQUEST' ? 'contained' : 'outlined'}
                                onClick={() => props.onSourceFilterChange('REQUEST')}
                                size="small"
                            >
                                Phiếu từ yêu cầu
                            </Button>
                            <Button
                                variant={props.sourceFilter === 'DESK' ? 'contained' : 'outlined'}
                                onClick={() => props.onSourceFilterChange('DESK')}
                                size="small"
                            >
                                Phiếu tại quầy
                            </Button>
                        </Box>

                        {props.requests.length === 0 ? (
                            <Typography color="text.secondary">Không có yêu cầu nào</Typography>
                        ) : (
                            <>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ background: '#f5f5f5' }}>
                                            <TableCell>Nguồn tạo</TableCell>
                                            <TableCell>Loại phiếu</TableCell>
                                            <TableCell>Người gửi</TableCell>
                                            <TableCell>Sách yêu cầu</TableCell>
                                            <TableCell>Phiếu mượn cần gia hạn</TableCell>
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
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        color={(req.source ?? 'REQUEST') === 'DESK' ? 'secondary' : 'default'}
                                                        label={(req.source ?? 'REQUEST') === 'DESK' ? 'Tại quầy' : 'Từ yêu cầu'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        color={req.requestType === 'RENEWAL' ? 'info' : 'default'}
                                                        label={req.requestType === 'RENEWAL' ? 'Gia hạn' : 'Mượn sách'}
                                                    />
                                                </TableCell>
                                                <TableCell>{req.userFullName || req.username || `User #${req.userId}`}</TableCell>
                                                <TableCell>{req.bookTitle || `Book #${req.bookId ?? '-'}`}</TableCell>
                                                <TableCell>{req.borrowRecordId ? `#${req.borrowRecordId}` : '-'}</TableCell>
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
