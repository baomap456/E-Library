import { Button, Card, CardContent, FormControlLabel, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import type { LibrarianDebtor } from '../../../types/modules/librarian';
import LibrarianTablePagination from '../LibrarianTablePagination';

type OnPageChange = (_: unknown, page: number) => void;
type RowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface DebtorFinesSectionProps {
    debtors: LibrarianDebtor[];
    totalCount: number;
    overdueOnly: boolean;
    onOverdueOnlyChange: (checked: boolean) => void;
    page: number;
    rowsPerPage: number;
    onPageChange: OnPageChange;
    onRowsPerPageChange: RowsPerPageChange;
    debtPaymentRecordId: string;
    debtPaymentAmount: string;
    onDebtPaymentRecordIdChange: (value: string) => void;
    onDebtPaymentAmountChange: (value: string) => void;
    onPartialDebtPayment: () => void;
}

export default function DebtorFinesSection(props: Readonly<DebtorFinesSectionProps>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quan ly phi phat</Typography>
                <FormControlLabel
                    control={<Switch checked={props.overdueOnly} onChange={(event) => props.onOverdueOnlyChange(event.target.checked)} />}
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
                        {props.debtors.map((debtor) => (
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
                    count={props.totalCount}
                    page={props.page}
                    rowsPerPage={props.rowsPerPage}
                    onPageChange={props.onPageChange}
                    onRowsPerPageChange={props.onRowsPerPageChange}
                />
            </CardContent>
        </Card>
    );
}
