import { Box, Card, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
    open: boolean;
};

export default function HomeRefreshIndicator({ open }: Props) {
    if (!open) {
        return null;
    }

    return (
        <Box sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1200 }}>
            <Card sx={{ px: 2, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} />
                    <Typography variant="body2">Đang cập nhật danh sách...</Typography>
                </Stack>
            </Card>
        </Box>
    );
}
