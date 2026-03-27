import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// Import các Component của bạn (Nhớ điều chỉnh lại đường dẫn cho đúng với thư mục của bạn nhé)
import Login from './pages/auth/Login';
// import Register from './Register';
// import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* CssBaseline là công cụ của MUI giúp reset lại CSS mặc định của trình duyệt, làm cho web đồng bộ và sạch sẽ */}
      <CssBaseline />

      <Routes>
        {/* 1. Mặc định khi vào trang chủ (localhost:5173), tự động đá người dùng sang trang Đăng nhập */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Tuyến đường cho trang Đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* 3. Các tuyến đường bạn sẽ làm tiếp theo (Tạm thời comment lại để không bị lỗi) */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* 4. Tuyến đường gom rác: Bất kỳ URL nào không tồn tại sẽ rơi vào đây (Trang 404) */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404</h1>
            <p>Trang bạn tìm kiếm không tồn tại!</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;