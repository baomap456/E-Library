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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1.2 }}>
                    <TextField
                        label="Mã phiếu"
                        value={props.debtPaymentRecordId}
                        onChange={(e) => props.onDebtPaymentRecordIdChange(e.target.value)}
                    />
                    <TextField
                        label="Số tiền thu"
                        type="number"
                        value={props.debtPaymentAmount}
                        onChange={(e) => props.onDebtPaymentAmountChange(e.target.value)}
                    />
                    <Button variant="contained" onClick={props.onPartialDebtPayment}>Thu nợ từng phần</Button>
                </Stack>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Reader</TableCell>
                            <TableCell>Sach</TableCell>
                            <TableCell align="right">Phi</TableCell>
                            <TableCell align="right">Tổng nợ</TableCell>
                            <TableCell align="right">Quá hạn (ngày)</TableCell>
                            <TableCell>Khóa mượn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.pagedDebtors.map((debtor) => (
                            <TableRow key={debtor.recordId}>
                                <TableCell>{debtor.username}</TableCell>
                                <TableCell>{debtor.bookTitle}</TableCell>
                                <TableCell align="right">{(debtor.fineAmount || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell align="right">{(debtor.outstandingDebt || 0).toLocaleString('vi-VN')}</TableCell>
                                <TableCell align="right">{debtor.overdueDays || 0}</TableCell>
                                <TableCell>{debtor.borrowingLocked ? 'Đang khóa' : 'Không'}</TableCell>
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
            </CardContent>
        </Card>
    );
}
