import {
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { BorrowingRecord } from '../../types/modules/borrowing';

type Props = Readonly<{
    records: BorrowingRecord[];
    renewingRecordId: number | null;
    onRenew: (recordId: number) => Promise<void>;
}>;

function isOverdueRecord(record: BorrowingRecord): boolean {
    return record.status === 'OVERDUE' || record.daysUntilDue < 0;
}

function dueDateColor(record: BorrowingRecord): 'error.main' | 'warning.main' | 'text.primary' {
    if (isOverdueRecord(record)) {
        return 'error.main';
    }
    if (record.daysUntilDue >= 1 && record.daysUntilDue <= 2) {
        return 'warning.main';
    }
    return 'text.primary';
}

function statusLabel(record: BorrowingRecord, isBorrowing: boolean): 'Quá hạn' | 'Đang mượn' | 'Đã trả' {
    if (isOverdueRecord(record)) {
        return 'Quá hạn';
    }
    return isBorrowing ? 'Đang mượn' : 'Đã trả';
}

function statusColor(record: BorrowingRecord, isBorrowing: boolean): 'error' | 'primary' | 'default' {
    if (isOverdueRecord(record)) {
        return 'error';
    }
    return isBorrowing ? 'primary' : 'default';
}

export default function BorrowingRecordsCard({ records, renewingRecordId, onRenew }: Props) {
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
                            const isRenewing = renewingRecordId === row.recordId;
                            const isLimitReached = row.renewalCount >= row.maxRenewals;
                            const disableReason = isLimitReached
                                ? 'Đã đạt giới hạn gia hạn'
                                : row.renewDisabledReason;
                            const dueColor = dueDateColor(row);
                            const highlightDueDate = dueColor !== 'text.primary';
                            const chipLabel = statusLabel(row, isBorrowing);
                            const chipColor = statusColor(row, isBorrowing);

                            return (
                                <TableRow key={row.recordId}>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 600 }}>{row.bookTitle}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Gia hạn: {row.renewalCount}/{row.maxRenewals}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            color={dueColor}
                                            sx={{ fontWeight: highlightDueDate ? 700 : 400 }}
                                        >
                                            {String(row.dueDate || '').slice(0, 10)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={chipLabel}
                                            color={chipColor}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {isBorrowing ? (
                                            <>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    disabled={!row.canRenew || isRenewing}
                                                    onClick={() => void onRenew(row.recordId)}
                                                    startIcon={isRenewing ? <CircularProgress size={14} /> : undefined}
                                                >
                                                    {isRenewing ? 'Đang gia hạn...' : 'Gia hạn'}
                                                </Button>
                                                {disableReason && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        {disableReason}
                                                    </Typography>
                                                )}
                                            </>
                                        ) : '-'}
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
