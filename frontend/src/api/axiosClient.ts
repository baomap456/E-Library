import axios from 'axios';

// 1. Khởi tạo một đối tượng axios với cấu hình mặc định
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Địa chỉ gốc Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Can thiệp vào Request (Trước khi gửi đi)
axiosClient.interceptors.request.use(
    (config) => {
        // Móc Token từ localStorage ra
        const token = localStorage.getItem('token');

        // Nếu có Token, tự động gắn vào Header của request
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. (Tùy chọn) Can thiệp vào Response (Khi nhận dữ liệu về)
axiosClient.interceptors.response.use(
    (response) => {
        // Chỉ lấy phần data trả về cho code gọn gàng
        return response.data;
    },
    (error) => {
        // Nếu Backend báo lỗi 401 (Hết hạn Token) -> Tự động đá văng ra trang Login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;