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
import UserLayout from './components/UserLayout';
import StaffLayout from './components/StaffLayout';
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

function RequireMember() {
  const user = getStoredUser();
  const isStaff = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);
  return isStaff ? <Navigate to="/app/librarian" replace /> : <Outlet />;
}

function RequireLibrarian() {
  const user = getStoredUser();
  const allowed = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);
  return allowed ? <Outlet /> : <Navigate to="/app/profile" replace />;
}

function LandingRedirect() {
  const user = getStoredUser();
  const isStaff = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);
  return <Navigate to={isStaff ? '/app/librarian' : '/app/profile'} replace />;
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
            <Route path="/" element={<LandingRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth />}>
              <Route element={<RequireMember />}>
                <Route element={<UserLayout />}>
                  <Route path="/app/profile" element={<AuthenticationPersonal />} />
                  <Route path="/app/auth-personal" element={<Navigate to="/app/profile" replace />} />
                  <Route path="/app/catalog" element={<CatalogDiscovery />} />
                  <Route path="/app/borrowing" element={<BorrowingReservation />} />
                  <Route path="/app/digital" element={<DigitalLibrary />} />
                </Route>
              </Route>

              <Route element={<RequireLibrarian />}>
                <Route element={<StaffLayout />}>
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