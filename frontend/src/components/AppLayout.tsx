import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import { hasRole } from '../api/session';

const drawerWidth = 280;

const navItems = [
    { label: 'Module 1: Authentication & Personal', path: '/app/auth-personal', librarianOnly: false },
    { label: 'Module 2: Catalog & Discovery', path: '/app/catalog', librarianOnly: false },
    { label: 'Module 3: Borrowing & Reservation', path: '/app/borrowing', librarianOnly: false },
    { label: 'Module 4: Digital Library', path: '/app/digital', librarianOnly: false },
    { label: 'Module 5: Librarian Panel', path: '/app/librarian', librarianOnly: true },
    { label: 'Module 6: Inventory & Reports', path: '/app/reports', librarianOnly: true },
];

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const isLibrarian = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: 'linear-gradient(90deg, #10439f 0%, #2f6edb 55%, #4b92ff 100%)',
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        E-Library Workspace
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#f27b22' }}>
                            {(user?.fullName || user?.username || 'U').slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600 }}>
                            {user?.fullName || user?.username || 'Reader'}
                        </Typography>
                        <Button color="inherit" variant="outlined" onClick={handleLogout}>
                            Đăng xuất
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: 0,
                        background: 'linear-gradient(180deg, #0d2d6c 0%, #123a8a 45%, #1750be 100%)',
                        color: '#fff',
                        p: 2,
                    },
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 800, p: 1, mb: 1 }}>
                    Smart Library
                </Typography>
                <List>
                    {navItems
                        .filter((item) => !item.librarianOnly || isLibrarian)
                        .map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <ListItemButton
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.7,
                                        bgcolor: active ? 'rgba(242, 123, 34, 0.95)' : 'rgba(255,255,255,0.06)',
                                        '&:hover': { bgcolor: active ? '#f27b22' : 'rgba(255,255,255,0.14)' },
                                    }}
                                >
                                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, lineHeight: 1.3 }} />
                                </ListItemButton>
                            );
                        })}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: 11,
                    px: { xs: 2, md: 4 },
                    pb: 4,
                    background:
                        'radial-gradient(circle at 100% 0%, rgba(47, 110, 219, 0.22), transparent 40%), radial-gradient(circle at 0% 100%, rgba(242,123,34,0.16), transparent 44%), #f5f7fb',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
