import { Alert, Box, Typography } from '@mui/material';

export default function LibrarianBorrowingNotice() {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Mượn trả của tôi
            </Typography>
            <Alert severity="info">
                Tài khoản thủ thư không được lập phiếu mượn cho chính mình. Bạn vẫn có thể tham gia hàng chờ,
                còn việc tạo phiếu mượn cho độc giả phải thực hiện trong khu vực quản trị.
            </Alert>
        </Box>
    );
}
