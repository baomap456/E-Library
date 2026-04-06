import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { forgotPassword } from '../../api/modules/authApi';

type ApiErrorBody = {
    message?: string;
};

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setTempPassword('');
        setSubmitting(true);

        try {
            const response = await forgotPassword({ identifier });
            setMessage(response.message);
            setTempPassword(response.tempPassword);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const apiError = err.response?.data as ApiErrorBody | undefined;
                setError(apiError?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
            } else {
                setError('Đã xảy ra lỗi không xác định.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Quên mật khẩu
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Nhập username hoặc email. Hệ thống sẽ tạo mật khẩu tạm thời cho bạn.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography>{message}</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                            Mật khẩu tạm thời: {tempPassword}
                        </Typography>
                    </Box>
                </Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username hoặc email"
                        margin="normal"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                        sx={{ mt: 2, height: 46, fontWeight: 700 }}
                    >
                        {submitting ? 'Đang xử lý...' : 'Tạo mật khẩu tạm thời'}
                    </Button>

                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                    >
                        Quay lại đăng nhập
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
