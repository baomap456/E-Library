import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchCatalogBooks, fetchCatalogHome } from '../../api/modules/catalogApi';
import { joinBorrowingWaitlist, submitBorrowRequest } from '../../api/modules/borrowingApi';
import { getStoredToken, getStoredUser, hasRole } from '../../api/session';
import type { CatalogBookItem, CatalogHomeResponse } from '../../types/modules/catalog';
import type { HomeSearchState } from '../../components/home/types';

type FeedbackState = Readonly<{ severity: 'success' | 'info' | 'warning' | 'error'; message: string }>;

function getDefaultPickupDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
}

function getDefaultReturnDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10);
}

function resolveApiErrorMessage(error: unknown, fallback: string) {
    if (!axios.isAxiosError(error)) {
        return fallback;
    }

    const responseData = error.response?.data;
    if (typeof responseData === 'string' && responseData.trim()) {
        return responseData;
    }

    const message = (responseData as { message?: string } | undefined)?.message;
    if (typeof message === 'string' && message.trim()) {
        return message;
    }

    return fallback;
}

export function useHomePage() {
    const navigate = useNavigate();
    const token = getStoredToken();
    const user = getStoredUser();
    const isStaff = hasRole(user, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);

    const [home, setHome] = useState<CatalogHomeResponse | null>(null);
    const [books, setBooks] = useState<CatalogBookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [bookPage, setBookPage] = useState(1);
    const booksPerPage = 6;
    const [selectedBorrowBook, setSelectedBorrowBook] = useState<CatalogBookItem | null>(null);
    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
    const [borrowSubmitting, setBorrowSubmitting] = useState(false);
    const [borrowDialogError, setBorrowDialogError] = useState('');
    const [queueNoticeOpen, setQueueNoticeOpen] = useState(false);
    const [queueNoticeMessage, setQueueNoticeMessage] = useState('');
    const [pickupDate, setPickupDate] = useState(getDefaultPickupDate);
    const [returnDate, setReturnDate] = useState(getDefaultReturnDate);
    const [search, setSearch] = useState<HomeSearchState>({
        q: '',
        category: '',
        author: '',
        publishYear: '',
    });

    const safeBooks = Array.isArray(books) ? books : [];

    const loadContent = async (withSpinner = false) => {
        if (withSpinner) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError('');
        try {
            const [homeData, bookData] = await Promise.all([
                fetchCatalogHome(),
                fetchCatalogBooks({}),
            ]);
            setHome(homeData);
            setBooks(Array.isArray(bookData) ? bookData : []);
        } catch {
            setError('Không thể tải dữ liệu trang chủ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        void loadContent(false);
    }, []);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            void loadContent(true);
        }, 15000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        setBookPage(1);
    }, [search.q, search.category, search.author, search.publishYear]);

    const categoryOptions = useMemo(() => {
        return Array.from(new Set(safeBooks.map((book) => book.category).filter(Boolean))).sort((left, right) => left.localeCompare(right));
    }, [safeBooks]);

    const authorOptions = useMemo(() => {
        return Array.from(new Set(safeBooks.flatMap((book) => book.author).filter(Boolean))).sort((left, right) => left.localeCompare(right));
    }, [safeBooks]);

    const yearOptions = useMemo(() => {
        return Array.from(new Set(safeBooks.map((book) => book.publishYear))).sort((left, right) => right - left);
    }, [safeBooks]);

    const filteredBooks = useMemo(() => {
        const normalizedQuery = search.q.trim().toLowerCase();
        const normalizedAuthor = search.author.trim().toLowerCase();
        const normalizedCategory = search.category.trim().toLowerCase();
        const normalizedYear = search.publishYear.trim();

        return safeBooks.filter((book) => {
            const matchesQuery = !normalizedQuery
                || book.title.toLowerCase().includes(normalizedQuery)
                || book.isbn.toLowerCase().includes(normalizedQuery)
                || book.author.some((author) => author.toLowerCase().includes(normalizedQuery));
            const matchesAuthor = !normalizedAuthor
                || book.author.some((author) => author.toLowerCase().includes(normalizedAuthor));
            const matchesCategory = !normalizedCategory || book.category.toLowerCase() === normalizedCategory;
            const matchesYear = !normalizedYear || String(book.publishYear) === normalizedYear;

            return matchesQuery && matchesAuthor && matchesCategory && matchesYear;
        });
    }, [safeBooks, search.author, search.category, search.publishYear, search.q]);

    const totalBookPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    const pagedBooks = useMemo(() => {
        const start = (bookPage - 1) * booksPerPage;
        return filteredBooks.slice(start, start + booksPerPage);
    }, [bookPage, filteredBooks]);

    useEffect(() => {
        if (bookPage > totalBookPages) {
            setBookPage(totalBookPages);
        }
    }, [bookPage, totalBookPages]);

    const primaryAction = useMemo(() => {
        if (!token) {
            return { label: 'Đăng nhập ngay', to: '/login' };
        }
        if (isStaff) {
            return { label: 'Vào bảng điều khiển thủ thư', to: '/app/librarian' };
        }
        return { label: 'Vào tài khoản của bạn', to: '/app/profile' };
    }, [isStaff, token]);

    const secondaryAction = token
        ? { label: 'Khám phá sách', to: '/app/book-list' }
        : { label: 'Tạo tài khoản', to: '/register' };

    const latestBooks = home?.newArrivals ?? [];
    const popularBooks = home?.mostBorrowed ?? [];
    const bannerText = home?.banners?.[0] || 'Thư viện mở cửa, tra cứu nhanh và mượn sách chỉ với vài thao tác.';
    const searchPlaceholder = home?.searchPlaceholder || 'Tìm theo tên sách, tác giả, ISBN...';

    const handleSearchChange = (field: keyof HomeSearchState, value: string) => {
        setSearch((prev) => ({ ...prev, [field]: value }));
    };

    const openBorrowSlip = (book: CatalogBookItem) => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (isStaff) {
            setFeedback({ severity: 'warning', message: 'Thủ thư không được mượn sách cho chính mình.' });
            return;
        }
        if (book.pendingRequests > 0) {
            setQueueNoticeMessage('Sách này đã có người xếp hàng chờ. Bạn cần tham gia hàng đợi thay vì lập phiếu mượn ngay.');
            setQueueNoticeOpen(true);
            return;
        }

        setSelectedBorrowBook(book);
        setPickupDate(getDefaultPickupDate());
        setReturnDate(getDefaultReturnDate());
        setBorrowDialogError('');
        setBorrowDialogOpen(true);
    };

    const closeBorrowSlip = () => {
        if (borrowSubmitting) {
            return;
        }
        setBorrowDialogOpen(false);
        setSelectedBorrowBook(null);
        setBorrowDialogError('');
    };

    const confirmBorrowSlip = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (isStaff) {
            setFeedback({ severity: 'warning', message: 'Thủ thư không được mượn sách cho chính mình.' });
            return;
        }
        if (!selectedBorrowBook) {
            return;
        }
        if (selectedBorrowBook.pendingRequests > 0) {
            setQueueNoticeMessage('Sách này đã có người xếp hàng chờ. Bạn cần tham gia hàng đợi thay vì lập phiếu mượn ngay.');
            setQueueNoticeOpen(true);
            return;
        }
        if (!pickupDate || !returnDate) {
            setBorrowDialogError('Bạn cần chọn đủ ngày lấy và ngày trả dự kiến.');
            return;
        }
        if (returnDate <= pickupDate) {
            setBorrowDialogError('Ngày trả dự kiến phải sau ngày lấy sách.');
            return;
        }

        try {
            setFeedback(null);
            setBorrowDialogError('');
            setBorrowSubmitting(true);
            await submitBorrowRequest(selectedBorrowBook.id, pickupDate, returnDate);
            await loadContent(true);
            setBorrowDialogOpen(false);
            setSelectedBorrowBook(null);
            setFeedback({ severity: 'success', message: 'Đã gửi yêu cầu mượn sách.' });
        } catch (error) {
            const message = resolveApiErrorMessage(error, 'Không thể gửi yêu cầu mượn sách. Vui lòng thử lại.');
            setBorrowDialogError(message);
            setFeedback({ severity: 'error', message });
        } finally {
            setBorrowSubmitting(false);
        }
    };

    const handleWaitlist = async (bookId: number) => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (isStaff) {
            setFeedback({ severity: 'warning', message: 'Thủ thư không được tham gia hàng chờ.' });
            return;
        }

        try {
            setFeedback(null);
            const response = await joinBorrowingWaitlist(bookId);
            await loadContent(true);
            setFeedback({ severity: 'success', message: `Bạn đang ở vị trí ${response.position} trong danh sách chờ.` });
        } catch (error) {
            const message = resolveApiErrorMessage(error, 'Không thể tham gia danh sách chờ. Vui lòng thử lại.');
            setFeedback({ severity: 'error', message });
        }
    };

    return {
        home,
        books,
        loading,
        refreshing,
        error,
        feedback,
        token,
        isStaff,
        search,
        categoryOptions,
        authorOptions,
        yearOptions,
        bannerText,
        searchPlaceholder,
        latestBooks,
        popularBooks,
        filteredBooks,
        booksPerPage,
        bookPage,
        totalBookPages,
        pagedBooks,
        selectedBorrowBook,
        borrowDialogOpen,
        borrowSubmitting,
        borrowDialogError,
        queueNoticeOpen,
        queueNoticeMessage,
        pickupDate,
        returnDate,
        primaryAction,
        secondaryAction,
        setBookPage,
        handleSearchChange,
        closeBorrowSlip,
        confirmBorrowSlip,
        setPickupDate,
        setReturnDate,
        setQueueNoticeOpen,
        openBorrowSlip,
        handleWaitlist,
    };
}