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
import StaffLayout from './components/StaffLayout';
import { getStoredToken, getStoredUser, hasRole } from './api/session';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AuthenticationPersonal = lazy(() => import('./pages/modules/AuthenticationPersonal.tsx'));
const HomePage = lazy(() => import('./pages/modules/HomePage.tsx'));
const BookList = lazy(() => import('./pages/modules/BookList.tsx'));
const BookDetail = lazy(() => import('./pages/modules/BookDetail.tsx'));
const CatalogDiscovery = lazy(() => import('./pages/modules/CatalogDiscovery.tsx'));
const BorrowingReservation = lazy(() => import('./pages/modules/BorrowingReservation.tsx'));
const DigitalLibrary = lazy(() => import('./pages/modules/DigitalLibrary.tsx'));
const LibrarianPanel = lazy(() => import('./pages/modules/LibrarianPanel.tsx'));
const LibrarianDashboardPage = lazy(() => import('./pages/modules/librarian/LibrarianDashboardPage.tsx'));
const LibrarianCirculationPage = lazy(() => import('./pages/modules/librarian/LibrarianCirculationPage.tsx'));
const LibrarianCatalogPage = lazy(() => import('./pages/modules/librarian/LibrarianCatalogPage.tsx'));
const LibrarianDebtorsPage = lazy(() => import('./pages/modules/librarian/LibrarianDebtorsPage.tsx'));
const LibrarianIncidentsPage = lazy(() => import('./pages/modules/librarian/LibrarianIncidentsPage.tsx'));
const LibrarianDigitalPage = lazy(() => import('./pages/modules/librarian/LibrarianDigitalPage.tsx'));
const LibrarianAccountsPage = lazy(() => import('./pages/modules/librarian/LibrarianAccountsPage.tsx'));
const LibrarianRequestsPage = lazy(() => import('./pages/modules/librarian/LibrarianRequestsPage.tsx'));
const LibrarianInventoryPage = lazy(() => import('./pages/modules/librarian/LibrarianInventoryPage.tsx'));

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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth />}>
              <Route element={<RequireMember />}>
                <Route element={<AppLayout />}>
                  <Route path="/app/profile" element={<AuthenticationPersonal />} />
                  <Route path="/app/auth-personal" element={<Navigate to="/app/profile" replace />} />
                  <Route path="/app/book-list" element={<BookList />} />
                  <Route path="/app/book-detail/:bookId" element={<BookDetail />} />
                  <Route path="/app/catalog" element={<CatalogDiscovery />} />
                  <Route path="/app/borrowing" element={<BorrowingReservation />} />
                  <Route path="/app/digital" element={<DigitalLibrary />} />
                </Route>
              </Route>

              <Route element={<RequireLibrarian />}>
                <Route element={<StaffLayout />}>
                  <Route path="/app/librarian" element={<LibrarianPanel />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<LibrarianDashboardPage />} />
                    <Route path="circulation" element={<LibrarianCirculationPage />} />
                    <Route path="catalog" element={<LibrarianCatalogPage />} />
                    <Route path="debtors" element={<LibrarianDebtorsPage />} />
                    <Route path="incidents" element={<LibrarianIncidentsPage />} />
                    <Route path="digital" element={<LibrarianDigitalPage />} />
                    <Route path="accounts" element={<LibrarianAccountsPage />} />
                    <Route path="requests" element={<LibrarianRequestsPage />} />
                    <Route path="inventory" element={<LibrarianInventoryPage />} />
                  </Route>
                  <Route path="/app/reports" element={<Navigate to="/app/librarian/dashboard" replace />} />
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
