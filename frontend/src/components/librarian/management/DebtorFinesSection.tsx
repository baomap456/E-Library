import { Button, Card, CardContent, FormControlLabel, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import LibrarianTablePagination from '../LibrarianTablePagination';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function DebtorFinesSection() {
    const props = useLibrarianManagementContext();
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quan ly phi phat</Typography>
                <FormControlLabel
                    control={<Switch checked={props.debtorOverdueOnly} onChange={(event) => props.onDebtorOverdueOnlyChange(event.target.checked)} />}
                    label="Danh sách quá hạn"
                    sx={{ mb: 1 }}
                />
                <TextField
                    fullWidth
                    label="Tìm theo tên khách hàng"
                    value={props.debtorSearch}
                    onChange={(event) => props.onDebtorSearchChange(event.target.value)}
                    sx={{ mb: 1.2 }}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1.2 }}>
                    <TextField
                        label="Số tiền thu"
                        type="number"
                        value={props.debtPaymentAmount}
                        onChange={(e) => props.onDebtPaymentAmountChange(e.target.value)}
                    />
                    <Button variant="contained" onClick={props.onPartialDebtPayment}>Thu nợ từng phần</Button>
                </Stack>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Phiếu đã chọn: {props.debtPaymentRecordId ? `#${props.debtPaymentRecordId}` : 'Chưa chọn'}
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Sach</TableCell>
                            <TableCell align="right">Phi</TableCell>
                            <TableCell align="right">Tổng nợ</TableCell>
                            <TableCell align="right">Quá hạn (ngày)</TableCell>
                            <TableCell>Khóa mượn</TableCell>
                            <TableCell align="right">Chọn phiếu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.pagedDebtors.map((debtor) => (
                            <TableRow key={debtor.recordId}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {debtor.fullName || debtor.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {debtor.username}
                                    </Typography>
                                </TableCell>
                                <TableCell>{debtor.bookTitle}</TableCell>
                                <TableCell align="right">{(debtor.fineAmount || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell align="right">{(debtor.outstandingDebt || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell align="right">{debtor.overdueDays || 0}</TableCell>
                                <TableCell>{debtor.borrowingLocked ? 'Đang khóa' : 'Không'}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant={props.debtPaymentRecordId === String(debtor.recordId) ? 'contained' : 'outlined'}
                                        onClick={() => props.onDebtPaymentRecordIdChange(String(debtor.recordId))}
                                    >
                                        Chọn
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <LibrarianTablePagination
                    count={props.debtorsCount}
                    page={props.debtorPage}
                    rowsPerPage={props.debtorRowsPerPage}
                    onPageChange={props.onDebtorPageChange}
                    onRowsPerPageChange={props.onDebtorRowsPerPageChange}
                />

                <Typography variant="h6" sx={{ mt: 3, mb: 1.2 }}>Bảng thống kê hoá đơn thu tiền phạt</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã hoá đơn</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Sách</TableCell>
                            <TableCell align="right">Số tiền</TableCell>
                            <TableCell>Ngày thu</TableCell>
                            <TableCell>Phương thức</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(props.fineInvoices ?? []).map((invoice) => (
                            <TableRow key={invoice.paymentId}>
                                <TableCell>{invoice.paymentId}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {invoice.fullName || invoice.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {invoice.username}
                                    </Typography>
                                </TableCell>
                                <TableCell>{invoice.bookTitle || '-'}</TableCell>
                                <TableCell align="right">{(invoice.amount || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell>{String(invoice.paymentDate || '').slice(0, 16).replace('T', ' ')}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Typography variant="h6" sx={{ mt: 3, mb: 1.2 }}>Bảng thống kê thu tiền phí của user</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell align="right">Số lần thu</TableCell>
                            <TableCell align="right">Đã thu</TableCell>
                            <TableCell align="right">Nợ còn lại</TableCell>
                            <TableCell>Khóa mượn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(props.userFineSummaries ?? []).map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {user.fullName || user.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {user.username}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">{user.paymentCount}</TableCell>
                                <TableCell align="right">{(user.totalPaidAmount || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell align="right">{(user.outstandingDebt || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell>{user.borrowingLocked ? 'Đang khóa' : 'Không'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
