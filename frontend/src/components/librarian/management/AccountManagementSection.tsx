import { Autocomplete, Button, Card, CardContent, Divider, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useLibrarianManagementContext } from './LibrarianManagementContext';
import { useMemo, useState } from 'react';
import LibrarianTablePagination from '../LibrarianTablePagination';

export default function AccountManagementSection() {
    const props = useLibrarianManagementContext();
    const [userSearch, setUserSearch] = useState('');
    const [userPage, setUserPage] = useState(0);
    const [userRowsPerPage, setUserRowsPerPage] = useState(5);
    const [invoicePage, setInvoicePage] = useState(0);
    const [invoiceRowsPerPage, setInvoiceRowsPerPage] = useState(5);

    const filteredUsers = useMemo(() => {
        const q = userSearch.trim().toLowerCase();
        if (!q) {
            return props.borrowers;
        }
        return props.borrowers.filter((borrower) => {
            const text = `${borrower.username} ${borrower.fullName || ''} ${borrower.email || ''} ${borrower.phone || ''} ${borrower.studentId || ''} ${borrower.membershipName || ''}`.toLowerCase();
            return text.includes(q);
        });
    }, [props.borrowers, userSearch]);

    const pagedUsers = useMemo(() => {
        const start = userPage * userRowsPerPage;
        return filteredUsers.slice(start, start + userRowsPerPage);
    }, [filteredUsers, userPage, userRowsPerPage]);

    const pagedMembershipInvoices = useMemo(() => {
        const start = invoicePage * invoiceRowsPerPage;
        return (props.membershipInvoices ?? []).slice(start, start + invoiceRowsPerPage);
    }, [props.membershipInvoices, invoicePage, invoiceRowsPerPage]);

    const handleUserPageChange = (_: unknown, nextPage: number) => {
        setUserPage(nextPage);
    };

    const handleUserRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserRowsPerPage(Number.parseInt(event.target.value, 10));
        setUserPage(0);
    };

    const handleInvoicePageChange = (_: unknown, nextPage: number) => {
        setInvoicePage(nextPage);
    };

    const handleInvoiceRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInvoiceRowsPerPage(Number.parseInt(event.target.value, 10));
        setInvoicePage(0);
    };

    const selectedBorrower = props.borrowers.find((borrower) => borrower.username === props.upgradeUsername);
    const selectedPackage = props.membershipPackageOptions.find((pkg) => pkg.name === props.upgradeTargetPackage);

    return (
        <Card>
            <CardContent>
                <Stack spacing={1.2}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Quản lý người dùng
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
                        Quản lý người dùng
                    </Typography>
                    <TextField
                        label="Tìm người dùng"
                        placeholder="Username / họ tên / email / số điện thoại"
                        fullWidth
                        value={userSearch}
                        onChange={(e) => {
                            setUserSearch(e.target.value);
                            setUserPage(0);
                        }}
                    />
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Họ tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Mã sinh viên</TableCell>
                                <TableCell>Gói thành viên</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pagedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Không tìm thấy người dùng phù hợp</TableCell>
                                </TableRow>
                            ) : (
                                pagedUsers.map((user) => (
                                    <TableRow key={user.userId}>
                                        <TableCell>{user.userId}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.fullName || '-'}</TableCell>
                                        <TableCell>{user.email || '-'}</TableCell>
                                        <TableCell>{user.phone || '-'}</TableCell>
                                        <TableCell>{user.studentId || '-'}</TableCell>
                                        <TableCell>{user.membershipName || '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <LibrarianTablePagination
                        count={filteredUsers.length}
                        page={userPage}
                        rowsPerPage={userRowsPerPage}
                        onPageChange={handleUserPageChange}
                        onRowsPerPageChange={handleUserRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 20]}
                    />

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
                            {pagedMembershipInvoices.map((invoice) => (
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
                    <LibrarianTablePagination
                        count={(props.membershipInvoices ?? []).length}
                        page={invoicePage}
                        rowsPerPage={invoiceRowsPerPage}
                        onPageChange={handleInvoicePageChange}
                        onRowsPerPageChange={handleInvoiceRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 20]}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
}