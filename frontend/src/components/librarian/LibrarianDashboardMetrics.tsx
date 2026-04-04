import { Box, Grid, Typography } from '@mui/material';
import type { LibrarianDashboard } from '../../types/modules/librarian';

type Props = {
    dashboard: LibrarianDashboard | null;
};

function Metric({ title, value }: { title: string; value: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(180deg, #ffffff, #eef4ff)',
                border: '1px solid #dde6fb',
            }}
        >
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
        </Box>
    );
}

export default function LibrarianDashboardMetrics({ dashboard }: Props) {
    return (
        <Grid container spacing={1.2}>
            <Grid size={{ xs: 12, sm: 4 }}><Metric title="Tổng sách" value={String(dashboard?.totalBooks || 0)} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Metric title="Đang cho mượn" value={String(dashboard?.borrowingNow || 0)} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Metric title="Lượt mượn hôm nay" value={String(dashboard?.borrowingsToday || 0)} /></Grid>
        </Grid>
    );
}
