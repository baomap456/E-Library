import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type RegisterRequest from '../../types/RegisterRequest';
import type AuthResponse from '../../types/AuthResponse';

type ApiErrorBody = {
    message?: string;
    fieldErrors?: Record<string, string>;
};

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        studentId: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (form.username.trim().length < 4) {
            setError('Username phải có ít nhất 4 ký tự.');
            return;
        }
        if (form.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setSubmitting(true);
        const payload: RegisterRequest = {
            username: form.username,
            password: form.password,
            email: form.email,
            fullName: form.fullName,
            studentId: form.studentId || undefined,
        };

        try {
            const data = await axiosClient.post<RegisterRequest, AuthResponse>('/auth/register', payload);
            localStorage.setItem('token', data.token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    username: data.username,
                    fullName: data.fullName,
                    roles: data.roles || ['ROLE_MEMBER'],
                }),
            );
            setSuccess('Đăng ký thành công! Hệ thống đang chuyển hướng...');
            setTimeout(() => navigate('/app/auth-personal'), 700);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const apiError = err.response?.data as ApiErrorBody | undefined;
                const firstFieldError = apiError?.fieldErrors
                    ? Object.values(apiError.fieldErrors)[0]
                    : undefined;
                setError(firstFieldError || apiError?.message || 'Không thể đăng ký. Vui lòng thử lại.');
            } else {
                setError('Đã xảy ra lỗi không xác định.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper
                elevation={4}
                sx={{
                    mt: 6,
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    Đăng Ký Tài Khoản
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Nhập thông tin cá nhân để tạo thẻ hội viên số.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Họ tên"
                        margin="normal"
                        value={form.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="MSSV / Mã nhân viên"
                        margin="normal"
                        value={form.studentId}
                        onChange={(e) => handleChange('studentId', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={form.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        margin="normal"
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Xác nhận mật khẩu"
                        margin="normal"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        required
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{ mt: 3, height: 46, fontWeight: 700 }}
                    >
                        {submitting ? 'Đang xử lý...' : 'Tạo tài khoản'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                    >
                        Đã có tài khoản? Quay lại đăng nhập
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
