import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

type Props = {
    open: boolean;
    action: 'approve' | 'reject';
    note: string;
    onChangeNote: (value: string) => void;
    onClose: () => void;
    onSubmit: () => Promise<void>;
};

export default function BorrowRequestReviewDialog({
    open,
    action,
    note,
    onChangeNote,
    onClose,
    onSubmit,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{action === 'approve' ? 'Duyệt phiếu mượn' : 'Từ chối phiếu mượn'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    margin="normal"
                    label="Ghi chú"
                    value={note}
                    onChange={(e) => onChangeNote(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={() => void onSubmit()}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}
