import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';

// 👇 IMPORT AXIOS CLIENT BẠN VỪA TẠO
import axiosClient from '../../api/axiosClient';
import type AuthResponse from '../../types/AuthResponse';
import type LoginRequest from '../../types/LoginRequest';
import axios from 'axios';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 🚀 FRONTEND CHÍNH THỨC GỌI API LOGIN XUỐNG BACKEND
            // Do baseURL đã cài là http://localhost:8080/api, nên ở đây chỉ cần gõ '/auth/login'
            const data = await axiosClient.post<LoginRequest, AuthResponse>('/auth/login', {
                username,
                password
            });

            // Nếu Backend trả về 200 OK, Axios sẽ tự động chạy xuống dòng này
            // 1. Lưu JWT và thông tin User vào két sắt của trình duyệt
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                username: data.username,
                fullName: data.fullName
            }));

            // 2. Chuyển hướng sang trang Dashboard
            navigate('/dashboard');

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    setError('Tài khoản hoặc mật khẩu không chính xác!');
                } else {
                    setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại Backend.');
                }
            } else {
                setError('Đã xảy ra lỗi không xác định.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}
            >
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Đăng Nhập
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên đăng nhập"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{ mt: 3, mb: 2, height: '48px', fontSize: '16px' }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng Nhập'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;