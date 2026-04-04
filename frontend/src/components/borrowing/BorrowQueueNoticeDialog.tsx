import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

type Props = Readonly<{
    open: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}>;

export default function BorrowQueueNoticeDialog({ open, title = 'Thông báo danh sách chờ', message, onClose }: Props) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography color="text.secondary" sx={{ pt: 0.5 }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Đã hiểu
                </Button>
            </DialogActions>
        </Dialog>
    );
}