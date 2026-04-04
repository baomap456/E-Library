import { Typography } from '@mui/material';

export default function LibrarianPageHeader() {
    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>Bảng điều khiển thủ thư</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Quản lý: check-in/check-out, phí phạt, yêu cầu mượn, sự cố.
            </Typography>
        </>
    );
}
