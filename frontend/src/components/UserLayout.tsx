import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';

const userNavItems = [
    { label: 'Tài khoản', path: '/app/profile' },
    { label: 'Tra cứu sách', path: '/app/catalog' },
    { label: 'Mượn trả', path: '/app/borrowing' },
    { label: 'Thư viện số', path: '/app/digital' },
];

export default function UserLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#f6f8fc' }}>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: 'linear-gradient(100deg, #0f4ca9 0%, #2d7ae6 70%, #53a2ff 100%)',
                }}
            >
                <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        E-Library | Cổng bạn đọc
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {userNavItems.map((item) => {
                            const active = location.pathname === item.path || (item.path === '/app/profile' && location.pathname === '/app/auth-personal');
                            return (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    variant={active ? 'contained' : 'text'}
                                    sx={{
                                        color: '#fff',
                                        bgcolor: active ? 'rgba(0,0,0,0.2)' : 'transparent',
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#f27b22' }}>
                            {(user?.fullName || user?.username || 'U').slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Button color="inherit" onClick={handleLogout}>Đăng xuất</Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
}
