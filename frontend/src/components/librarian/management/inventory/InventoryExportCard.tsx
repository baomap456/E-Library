import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';

type Props = {
    period: string;
    onPeriodChange: (value: string) => void;
    onExport: (format: 'excel' | 'pdf') => void;
};

export default function InventoryExportCard({ period, onPeriodChange, onExport }: Readonly<Props>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Export</Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => onExport('excel')}>Xuất Excel</Button>
                    <Button variant="outlined" onClick={() => onExport('pdf')}>Xuất PDF</Button>
                </Stack>
                <TextField
                    select
                    label="Chu kỳ"
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    fullWidth
                    sx={{ mt: 1.2 }}
                >
                    <MenuItem value="month">Theo tháng</MenuItem>
                    <MenuItem value="quarter">Theo quý</MenuItem>
                    <MenuItem value="year">Theo năm</MenuItem>
                </TextField>
            </CardContent>
        </Card>
    );
}
