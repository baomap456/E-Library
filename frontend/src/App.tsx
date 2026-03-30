import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import AppLayout from './components/AppLayout';
import { getStoredToken, getStoredUser, hasRole } from './api/session';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AuthenticationPersonal = lazy(() => import('./pages/modules/AuthenticationPersonal.tsx'));
const CatalogDiscovery = lazy(() => import('./pages/modules/CatalogDiscovery.tsx'));
const BorrowingReservation = lazy(() => import('./pages/modules/BorrowingReservation.tsx'));
const DigitalLibrary = lazy(() => import('./pages/modules/DigitalLibrary.tsx'));
const LibrarianPanel = lazy(() => import('./pages/modules/LibrarianPanel.tsx'));
const InventoryReports = lazy(() => import('./pages/modules/InventoryReports.tsx'));

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#10439f' },
    secondary: { main: '#f27b22' },
    background: { default: '#f5f7fb' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
  },
});

function RequireAuth() {
  const token = getStoredToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function RequireLibrarian() {
  const user = getStoredUser();
  const allowed = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);
  return allowed ? <Outlet /> : <Navigate to="/app/auth-personal" replace />;
}

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        404
      </Typography>
      <Typography>Trang bạn tìm kiếm không tồn tại.</Typography>
    </Box>
  );
}

function RouteFallback() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/app/auth-personal" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/app/auth-personal" element={<AuthenticationPersonal />} />
                <Route path="/app/catalog" element={<CatalogDiscovery />} />
                <Route path="/app/borrowing" element={<BorrowingReservation />} />
                <Route path="/app/digital" element={<DigitalLibrary />} />
                <Route element={<RequireLibrarian />}>
                  <Route path="/app/librarian" element={<LibrarianPanel />} />
                  <Route path="/app/reports" element={<InventoryReports />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;