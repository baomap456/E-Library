import { Button, Card, CardContent, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function AccountManagementSection() {
    const props = useLibrarianManagementContext();

    return (
        <Card>
            <CardContent>
                <Stack spacing={1.2}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Quản lý tài khoản bạn đọc
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Tạo người dùng trực tiếp
                    </Typography>
                    <TextField
                        label="Username mới"
                        fullWidth
                        value={props.newUserUsername}
                        onChange={(e) => props.onNewUserUsernameChange(e.target.value)}
                    />
                    <TextField
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        value={props.newUserPassword}
                        onChange={(e) => props.onNewUserPasswordChange(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={props.newUserEmail}
                        onChange={(e) => props.onNewUserEmailChange(e.target.value)}
                    />
                    <TextField
                        label="Họ tên"
                        fullWidth
                        value={props.newUserFullName}
                        onChange={(e) => props.onNewUserFullNameChange(e.target.value)}
                    />
                    <TextField
                        label="Mã sinh viên (tùy chọn)"
                        fullWidth
                        value={props.newUserStudentId}
                        onChange={(e) => props.onNewUserStudentIdChange(e.target.value)}
                    />
                    <Button variant="contained" color="success" onClick={props.onCreateUserDirect}>
                        Tạo người dùng
                    </Button>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Nâng cấp tài khoản trực tiếp
                    </Typography>
                    <TextField
                        label="Username cần nâng cấp"
                        fullWidth
                        value={props.upgradeUsername}
                        onChange={(e) => props.onUpgradeUsernameChange(e.target.value)}
                    />
                    <TextField
                        select
                        label="Gói thành viên"
                        fullWidth
                        value={props.upgradeTargetPackage}
                        onChange={(e) => props.onUpgradeTargetPackageChange(e.target.value)}
                    >
                        {props.membershipPackageOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" color="warning" onClick={props.onUpgradeAccountDirect}>
                        Nâng cấp ngay
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}