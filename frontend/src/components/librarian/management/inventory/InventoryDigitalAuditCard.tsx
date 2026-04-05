import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReportsDigitalAuditResponse, ReportsFinancial } from '../../../../types/modules/reports';

type Props = {
    financial: ReportsFinancial | null;
    lastAudit: ReportsDigitalAuditResponse | null;
    onRunAudit: () => void;
};

export default function InventoryDigitalAuditCard({ financial, lastAudit, onRunAudit }: Readonly<Props>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Kiểm kê tài liệu số</Typography>
                <Stack spacing={1.2}>
                    <Button variant="contained" onClick={onRunAudit}>Quét link tài liệu số</Button>
                    <Typography>Đã thu tiền phạt: {(financial?.paidFineRevenue || 0).toLocaleString('vi-VN')} VND</Typography>
                    <Typography>Nợ phí tồn: {(financial?.outstandingDebt || 0).toLocaleString('vi-VN')} VND</Typography>
                    {lastAudit && (
                        <Typography color="text.secondary">Link lỗi: {lastAudit.brokenCount}/{lastAudit.checkedCount}</Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
