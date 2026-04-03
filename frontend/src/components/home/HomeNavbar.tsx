import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { getStoredUser, getStoredToken, hasRole } from '../../api/session';

type Props = {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    showSearch?: boolean;
};

export default function HomeNavbar({ searchValue = '', onSearchChange, showSearch = true }: Props) {
    const navigate = useNavigate();
    const token = getStoredToken();
    const user = getStoredUser();
    const isStaff = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    const navItems = [
        { label: 'Trang chủ', to: '/' },
        { label: 'Khám phá sách', to: '/app/book-list' },
        { label: 'Thư viện số', to: '/app/digital' },
    ];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                mb: 3,
                borderRadius: 3,
                overflow: 'hidden',
                background: 'linear-gradient(100deg, #0f4ca9 0%, #2d7ae6 70%, #53a2ff 100%)',
                boxShadow: '0 18px 35px rgba(16,67,159,0.15)',
            }}
        >
            <Toolbar sx={{ gap: 2, justifyContent: 'space-between', flexWrap: 'wrap', py: 1.2 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.2, lineHeight: 1.1 }}>
                            Thư viện E-Library
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                            Tra cứu - Mượn sách - Theo dõi trạng thái
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                variant="text"
                                sx={{ color: '#fff', opacity: 0.94, whiteSpace: 'nowrap' }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Stack>

                {showSearch && onSearchChange && (
                    <TextField
                        size="small"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Tìm nhanh sách, tác giả, ISBN..."
                        sx={{
                            minWidth: { xs: '100%', md: 320 },
                            flex: { xs: '1 1 100%', md: '1 1 320px' },
                            '& .MuiInputBase-root': {
                                bgcolor: 'rgba(255,255,255,0.96)',
                                borderRadius: 999,
                            },
                        }}
                    />
                )}

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        component={RouterLink}
                        to={token ? (isStaff ? '/app/librarian' : '/app/profile') : '/login'}
                        variant="outlined"
                        sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}
                    >
                        {token ? (isStaff ? 'Thủ thư' : 'Tài khoản của tôi') : 'Đăng nhập'}
                    </Button>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: '#f27b22' }}>
                        {(user?.fullName || user?.username || 'U').slice(0, 1).toUpperCase()}
                    </Avatar>
                    {token && (
                        <Button color="inherit" onClick={handleLogout} sx={{ color: '#fff', whiteSpace: 'nowrap' }}>
                            Đăng xuất
                        </Button>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}