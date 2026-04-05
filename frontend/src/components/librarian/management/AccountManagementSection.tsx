import { Autocomplete, Button, Card, CardContent, Divider, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function AccountManagementSection() {
    const props = useLibrarianManagementContext();
    const selectedBorrower = props.borrowers.find((borrower) => borrower.username === props.upgradeUsername);
    const selectedPackage = props.membershipPackageOptions.find((pkg) => pkg.name === props.upgradeTargetPackage);

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
                    <Typography variant="body2" color="text.secondary">
                        Thủ thư thực hiện nâng cấp tại quầy và hệ thống sẽ lưu hoá đơn membership.
                    </Typography>
                    <Autocomplete
                        options={props.borrowers}
                        value={selectedBorrower || null}
                        getOptionLabel={(option) => `${option.username} - ${option.fullName || 'N/A'}`}
                        filterOptions={(options, state) => {
                            const q = state.inputValue.trim().toLowerCase();
                            if (!q) {
                                return options;
                            }
                            return options.filter((option) => {
                                const text = `${option.username} ${option.fullName || ''} ${option.email || ''} ${option.phone || ''}`.toLowerCase();
                                return text.includes(q);
                            });
                        }}
                        onChange={(_, value) => props.onUpgradeUsernameChange(value?.username ?? '')}
                        onInputChange={(_, value, reason) => {
                            if (reason === 'input') {
                                props.onUpgradeUsernameChange(value.trim());
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tìm user để nâng cấp"
                                placeholder="Nhập username / họ tên / email"
                                fullWidth
                            />
                        )}
                    />
                    <TextField
                        label="User ID"
                        fullWidth
                        value={selectedBorrower?.userId ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Username"
                        fullWidth
                        value={selectedBorrower?.username ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Họ tên"
                        fullWidth
                        value={selectedBorrower?.fullName ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={selectedBorrower?.email ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Số điện thoại"
                        fullWidth
                        value={selectedBorrower?.phone ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Mã sinh viên"
                        fullWidth
                        value={selectedBorrower?.studentId ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Gói hiện tại"
                        fullWidth
                        value={selectedBorrower?.membershipName ?? ''}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        select
                        label="Gói thành viên"
                        fullWidth
                        value={props.upgradeTargetPackage}
                        onChange={(e) => props.onUpgradeTargetPackageChange(e.target.value)}
                    >
                        {props.membershipPackageOptions.map((option) => (
                            <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Giá gói nâng cấp (VND)"
                        fullWidth
                        value={(selectedPackage?.price || 0).toLocaleString('vi-VN')}
                        InputProps={{ readOnly: true }}
                    />
                    <Button variant="contained" color="warning" onClick={props.onUpgradeAccountDirect}>
                        Nâng cấp tại quầy
                    </Button>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Hoá đơn membership
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Khách hàng</TableCell>
                                <TableCell>Người thực hiện</TableCell>
                                <TableCell>Kênh</TableCell>
                                <TableCell>Hành động</TableCell>
                                <TableCell align="right">Số tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(props.membershipInvoices ?? []).map((invoice) => (
                                <TableRow key={invoice.transactionId}>
                                    <TableCell>{`HD-${invoice.transactionId}`}</TableCell>
                                    <TableCell>{String(invoice.createdAt || '').slice(0, 19).replace('T', ' ')}</TableCell>
                                    <TableCell>{invoice.fullName || invoice.username || '-'}</TableCell>
                                    <TableCell>{invoice.actorUsername || '-'}</TableCell>
                                    <TableCell>{invoice.paymentChannel || '-'}</TableCell>
                                    <TableCell>{invoice.action}</TableCell>
                                    <TableCell align="right">{(invoice.amount || 0).toLocaleString('vi-VN')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Stack>
            </CardContent>
        </Card>
    );
}