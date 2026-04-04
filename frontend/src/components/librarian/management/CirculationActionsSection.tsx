import {
    Autocomplete,
    Checkbox,
    Divider,
    FormControlLabel,
    MenuItem,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function CirculationActionsSection() {
    const props = useLibrarianManagementContext();
    const availableBooks = props.allBooks.filter((book) => {
        if (!(book.availableCopies > 0 && !!book.availableBarcode)) {
            return false;
        }
        if (props.guestBorrowMode && props.guestLoanType === 'TAKE_HOME') {
            return book.canTakeHome !== false;
        }
        return true;
    });
    const selectedBook = availableBooks.find((book) => book.availableBarcode === props.barcode) || null;
    const selectedBorrower = props.borrowers.find((item) => item.username === props.username) || null;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Lập phiếu mượn trực tiếp / Check-in</Typography>
                <Stack spacing={1.2}>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={props.guestBorrowMode}
                                onChange={(event) => props.onGuestBorrowModeChange(event.target.checked)}
                            />
                        )}
                        label="Khách không lập tài khoản"
                    />

                    {!props.guestBorrowMode && (
                        <Autocomplete
                            options={props.borrowers}
                            value={selectedBorrower}
                            onChange={(_, value) => props.onUsernameChange(value?.username ?? '')}
                            getOptionLabel={(option) => `${option.username} - ${option.fullName || option.email}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tìm người mượn"
                                    helperText="Chọn tài khoản người mượn từ danh sách"
                                />
                            )}
                        />
                    )}

                    {props.guestBorrowMode && (
                        <>
                            <TextField
                                label="Tên khách"
                                fullWidth
                                value={props.guestName}
                                onChange={(e) => props.onGuestNameChange(e.target.value)}
                            />
                            <TextField
                                label="Số điện thoại (tùy chọn)"
                                fullWidth
                                value={props.guestPhone}
                                onChange={(e) => props.onGuestPhoneChange(e.target.value)}
                            />
                            <TextField
                                select
                                label="Hình thức mượn"
                                fullWidth
                                value={props.guestLoanType}
                                onChange={(e) => props.onGuestLoanTypeChange(e.target.value as 'TAKE_HOME' | 'READ_ON_SITE')}
                            >
                                <MenuItem value="TAKE_HOME">Mượn mang về</MenuItem>
                                <MenuItem value="READ_ON_SITE">Mượn đọc tại chỗ</MenuItem>
                            </TextField>
                            {props.guestLoanType === 'TAKE_HOME' && (
                                <>
                                    <TextField
                                        label="CCCD khách vãng lai"
                                        fullWidth
                                        value={props.guestCitizenId}
                                        onChange={(e) => props.onGuestCitizenIdChange(e.target.value)}
                                        helperText="Bắt buộc khi khách mang sách về"
                                    />
                                    <TextField
                                        label="Tiền cọc ứng trước (VND)"
                                        type="number"
                                        fullWidth
                                        value={props.guestDepositAmount}
                                        onChange={(e) => props.onGuestDepositAmountChange(e.target.value)}
                                        helperText="Bắt buộc khi khách mượn mang về"
                                    />
                                </>
                            )}
                        </>
                    )}
                    <Autocomplete
                        options={availableBooks}
                        value={selectedBook}
                        onChange={(_, value) => props.onBarcodeChange(value?.availableBarcode ?? '')}
                        getOptionLabel={(option) => `${option.title} (${option.availableBarcode})`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tìm sách để lập phiếu mượn"
                                helperText="Chọn đầu sách, hệ thống tự lấy barcode khả dụng"
                            />
                        )}
                    />
                    <TextField
                        label="Barcode đã chọn"
                        fullWidth
                        value={props.barcode}
                        disabled
                    />
                    {!props.guestBorrowMode && <Button variant="contained" onClick={props.onCheckout}>Xác nhận giao sách</Button>}
                    {props.guestBorrowMode && <Button variant="contained" onClick={props.onGuestCheckout}>Lập phiếu mượn cho khách</Button>}
                    <Button variant="outlined" onClick={props.onCheckin}>Xác nhận trả sách</Button>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tạo người dùng trực tiếp</Typography>
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

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Nâng cấp tài khoản trực tiếp</Typography>
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
