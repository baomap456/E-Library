import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReportsTrend } from '../../../../types/modules/reports';

type Props = {
    trends: ReportsTrend[];
};

export default function InventoryTrendCard({ trends }: Readonly<Props>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Thống kê xu hướng</Typography>
                <Box sx={{ borderRadius: 2, border: '1px dashed #c9d7f4', p: 2 }}>
                    {trends.map((item) => (
                        <Typography key={String(item.date)}>{String(item.date).slice(0, 10)}: {item.borrowCount} lượt mượn</Typography>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
