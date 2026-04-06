import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { ReportsPhysicalAuditResponse } from '../../../../types/modules/reports';

type Props = {
    barcode: string;
    observedState: 'ON_SHELF' | 'MISSING' | 'DAMAGED';
    note: string;
    lastAudit: ReportsPhysicalAuditResponse | null;
    onBarcodeChange: (value: string) => void;
    onObservedStateChange: (value: 'ON_SHELF' | 'MISSING' | 'DAMAGED') => void;
    onNoteChange: (value: string) => void;
    onRunAudit: () => void;
};

export default function InventoryPhysicalAuditCard({
    barcode,
    observedState,
    note,
    lastAudit,
    onBarcodeChange,
    onObservedStateChange,
    onNoteChange,
    onRunAudit,
}: Readonly<Props>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Kiểm kê vật lý</Typography>
                <Stack spacing={1.2}>
                    <TextField label="Barcode" value={barcode} onChange={(e) => onBarcodeChange(e.target.value)} />
                    <TextField select label="Trạng thái quan sát" value={observedState} onChange={(e) => onObservedStateChange(e.target.value as 'ON_SHELF' | 'MISSING' | 'DAMAGED')}>
                        <MenuItem value="ON_SHELF">Có trên kệ</MenuItem>
                        <MenuItem value="MISSING">Không tìm thấy</MenuItem>
                        <MenuItem value="DAMAGED">Hư hại</MenuItem>
                    </TextField>
                    <TextField label="Ghi chú" value={note} onChange={(e) => onNoteChange(e.target.value)} />
                    <Button variant="contained" onClick={onRunAudit}>Chạy kiểm kê vật lý</Button>
                    {lastAudit && (
                        <Typography color="text.secondary">Kết quả: {lastAudit.result} - {lastAudit.message}</Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
