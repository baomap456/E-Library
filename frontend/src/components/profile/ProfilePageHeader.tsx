import { Typography } from '@mui/material';

export default function ProfilePageHeader() {
    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Tài khoản của tôi
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Hồ sơ bạn đọc, hạng thành viên và thông báo cá nhân.
            </Typography>
        </>
    );
}
