import { Alert, Box, Typography } from '@mui/material';

export default function LibrarianBorrowingNotice() {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Mượn trả của tôi
            </Typography>
            <Alert severity="info">
                Thủ thư không thể mượn sách. Vui lòng sử dụng chức năng "Quản trị thư viện" để duyệt yêu cầu mượn từ độc giả.
            </Alert>
        </Box>
    );
}
