import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

export default function UserLayout() {
    return (
        <Box sx={{ minHeight: '100vh', background: '#f6f8fc' }}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
}
