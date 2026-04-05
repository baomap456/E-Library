import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { fetchBorrowRecordByBarcode, payFinePartial, reportBorrowIncident } from '../../../api/modules/librarianApi';
import type { BorrowingRecord } from '../../../types/modules/borrowing';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function ReturnBorrowRecordSection() {
    const props = useLibrarianManagementContext();
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [incidentType, setIncidentType] = useState<'LOST' | 'DAMAGED'>('DAMAGED');
    const [damageSeverity, setDamageSeverity] = useState<'LIGHT' | 'HEAVY'>('LIGHT');
    const [repairCost, setRepairCost] = useState('');
    const [lostCompensationRate, setLostCompensationRate] = useState<'100' | '150'>('100');
    const [incidentNote, setIncidentNote] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const barcode = props.barcode.trim();
    const fineAmount = useMemo(() => Number(selectedRecord?.fineAmount ?? 0), [selectedRecord?.fineAmount]);

    useEffect(() => {
        let ignore = false;
        const timer = window.setTimeout(() => {
            const search = async () => {
                if (!barcode) {
                    setSelectedRecord(null);
                    setLookupError('');
                    setActionMessage('');
                    return;
                }

                setLookupLoading(true);
                setLookupError('');
                setActionMessage('');
                try {
                    const record = await fetchBorrowRecordByBarcode(barcode);
                    if (!ignore) {
                        setSelectedRecord(record);
                        setPaymentAmount(String(Math.max(0, Number(record.fineAmount || 0))));
                        setIncidentType('DAMAGED');
                        setDamageSeverity('LIGHT');
                        setRepairCost('');
                        setLostCompensationRate('100');
                        setIncidentNote('');
                    }
                } catch (error) {
                    if (!ignore) {
                        setSelectedRecord(null);
                        setLookupError('Không tìm thấy phiếu mượn đang mở theo barcode này.');
                    }
                    console.error(error);
                } finally {
                    if (!ignore) {
                        setLookupLoading(false);
                    }
                }
            };
            void search();
        }, 350);

        return () => {
            ignore = true;
            window.clearTimeout(timer);
        };
    }, [barcode]);

    const updateSelectedRecord = (patch: Partial<BorrowingRecord>) => {
        setSelectedRecord((current) => (current ? { ...current, ...patch } : current));
    };

    const handleCheckin = async () => {
        if (!selectedRecord) {
            return;
        }
        try {
            const succeeded = await props.onCheckin();
            if (succeeded) {
                setActionMessage('Đã trả sách thành công.');
                updateSelectedRecord({
                    returnDate: new Date().toISOString(),
                    status: 'AVAILABLE',
                });
            }
        } catch {
            setActionMessage('Không thể trả sách.');
        }
    };

    const handlePayFine = async () => {
        if (!selectedRecord) {
            return;
        }
        const amount = Number.parseFloat(paymentAmount || '0');
        if (!Number.isFinite(amount) || amount <= 0) {
            setActionMessage('Vui lòng nhập số tiền đóng phạt hợp lệ.');
            return;
        }

        try {
            await payFinePartial(selectedRecord.recordId, amount);
            setActionMessage('Đã ghi nhận đóng phạt.');
            updateSelectedRecord({
                fineAmount: Math.max(0, Number(selectedRecord.fineAmount || 0) - amount),
            });
        } catch {
            setActionMessage('Không thể ghi nhận đóng phạt.');
        }
    };

    const handleReportIncident = async () => {
        if (!selectedRecord) {
            return;
        }

        try {
            const payload = incidentType === 'DAMAGED'
                ? {
                    recordId: selectedRecord.recordId,
                    incidentType,
                    damageSeverity,
                    repairCost: Number.parseFloat(repairCost || '0'),
                    note: incidentNote.trim() || undefined,
                }
                : {
                    recordId: selectedRecord.recordId,
                    incidentType,
                    lostCompensationRate,
                    note: incidentNote.trim() || undefined,
                };

            await reportBorrowIncident(payload as Parameters<typeof reportBorrowIncident>[0]);
            setActionMessage('Đã ghi nhận sự cố.');
            updateSelectedRecord({
                incidentType,
                damageSeverity: incidentType === 'DAMAGED' ? damageSeverity : null,
                incidentNote: incidentNote.trim() || null,
            });
        } catch {
            setActionMessage('Không thể ghi nhận sự cố.');
        }
    };

    return (
        <Card>
            <CardContent>
                <Stack spacing={1.4}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>Trả sách</Typography>
                        <Typography color="text.secondary">
                            Nhập hoặc quét barcode, hệ thống sẽ tìm phiếu mượn đang mở và hiển thị toàn bộ thông tin.
                        </Typography>
                    </Box>

                    <TextField
                        label="Barcode"
                        fullWidth
                        value={props.barcode}
                        onChange={(event) => props.onBarcodeChange(event.target.value)}
                        helperText="Tìm phiếu bằng barcode của cuốn sách"
                    />

                    {lookupLoading && <Alert severity="info">Đang tìm phiếu mượn...</Alert>}
                    {lookupError && <Alert severity="warning">{lookupError}</Alert>}
                    {actionMessage && <Alert severity="success">{actionMessage}</Alert>}

                    {selectedRecord && (
                        <Stack spacing={1.2}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Grid container spacing={1.4}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Người mượn</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>{selectedRecord.userFullName || selectedRecord.username}</Typography>
                                            <Typography variant="body2" color="text.secondary">{selectedRecord.username}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Sách</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>{selectedRecord.bookTitle}</Typography>
                                            <Typography variant="body2" color="text.secondary">Barcode: {selectedRecord.barcode}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Ngày mượn</Typography>
                                            <Typography>{selectedRecord.borrowDate ? new Date(selectedRecord.borrowDate).toLocaleString('vi-VN') : '-'}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Hạn trả</Typography>
                                            <Typography>{selectedRecord.dueDate ? new Date(selectedRecord.dueDate).toLocaleString('vi-VN') : '-'}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Tình trạng</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>{selectedRecord.status}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Phạt hiện tại</Typography>
                                            <Typography sx={{ color: 'error.main', fontWeight: 700 }}>
                                                {Number(selectedRecord.fineAmount || 0).toLocaleString('vi-VN')} VND
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Tiền cọc</Typography>
                                            <Typography>{Number(selectedRecord.depositAmount || 0).toLocaleString('vi-VN')} VND</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Hình thức</Typography>
                                            <Typography>{selectedRecord.borrowMode === 'READ_ON_SITE' ? 'Đọc tại chỗ' : 'Mượn mang về'}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Divider />

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
                                <Button variant="contained" onClick={() => void handleCheckin()}>
                                    Xác nhận trả sách
                                </Button>
                                <Button variant="outlined" onClick={() => void handlePayFine()} disabled={fineAmount <= 0}>
                                    Đóng phạt
                                </Button>
                            </Stack>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Báo cáo sự cố</Typography>
                                    <Stack spacing={1.2}>
                                        <TextField
                                            select
                                            label="Loại sự cố"
                                            value={incidentType}
                                            onChange={(event) => setIncidentType(event.target.value as 'LOST' | 'DAMAGED')}
                                        >
                                            <MenuItem value="DAMAGED">Hư hại</MenuItem>
                                            <MenuItem value="LOST">Mất sách</MenuItem>
                                        </TextField>

                                        {incidentType === 'DAMAGED' ? (
                                            <>
                                                <TextField
                                                    select
                                                    label="Mức độ hư hại"
                                                    value={damageSeverity}
                                                    onChange={(event) => setDamageSeverity(event.target.value as 'LIGHT' | 'HEAVY')}
                                                >
                                                    <MenuItem value="LIGHT">Nhẹ</MenuItem>
                                                    <MenuItem value="HEAVY">Nặng</MenuItem>
                                                </TextField>
                                                <TextField
                                                    label="Chi phí sửa chữa"
                                                    type="number"
                                                    value={repairCost}
                                                    onChange={(event) => setRepairCost(event.target.value)}
                                                />
                                            </>
                                        ) : (
                                            <TextField
                                                select
                                                label="Tỉ lệ bồi thường"
                                                value={lostCompensationRate}
                                                onChange={(event) => setLostCompensationRate(event.target.value as '100' | '150')}
                                            >
                                                <MenuItem value="100">100%</MenuItem>
                                                <MenuItem value="150">150%</MenuItem>
                                            </TextField>
                                        )}

                                        <TextField
                                            label="Ghi chú sự cố"
                                            value={incidentNote}
                                            onChange={(event) => setIncidentNote(event.target.value)}
                                            fullWidth
                                            multiline
                                            minRows={2}
                                        />

                                        <Button variant="contained" onClick={() => void handleReportIncident()}>
                                            Ghi nhận sự cố
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}