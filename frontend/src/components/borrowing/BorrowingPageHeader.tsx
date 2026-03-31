import { Typography } from '@mui/material';

export default function BorrowingPageHeader() {
    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Mượn trả của tôi
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Quản lý đặt mượn, theo dõi hạn trả và phí trễ hạn.
            </Typography>
        </>
    );
}
