import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    fetchCatalogBookDetail,
    fetchCatalogBooks,
    fetchCatalogHome,
} from '../../api/modules/catalogApi';
import { joinBorrowingWaitlist, submitBorrowRequest } from '../../api/modules/borrowingApi';
import type {
    CatalogBookDetailResponse,
    CatalogBookItem,
    CatalogHomeResponse,
    CatalogSearchParams,
} from '../../types/modules/catalog';

export function useCatalogDiscovery() {
    const [books, setBooks] = useState<CatalogBookItem[]>([]);
    const [home, setHome] = useState<CatalogHomeResponse | null>(null);
    const [detail, setDetail] = useState<CatalogBookDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

    const [search, setSearch] = useState({
        q: '',
        author: '',
        category: '',
        publishYear: '',
        status: 'available',
    });

    const selectedBook = useMemo(
        () => books.find((book) => book.id === selectedBookId) || books[0] || null,
        [books, selectedBookId],
    );

    const loadBooks = async () => {
        const params: CatalogSearchParams = {};
        if (search.q) params.q = search.q;
        if (search.author) params.author = search.author;
        if (search.category) params.category = search.category;
        if (search.publishYear) params.publishYear = search.publishYear;
        if (search.status) params.status = search.status;

        const data = await fetchCatalogBooks(params);
        setBooks(data);
        if (data.length > 0) {
            setSelectedBookId(data[0].id);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const homeData = await fetchCatalogHome();
                setHome(homeData);
                await loadBooks();
            } catch {
                setError('Không thể tải dữ liệu catalog.');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!selectedBook?.id) {
                return;
            }
            try {
                const data = await fetchCatalogBookDetail(selectedBook.id);
                setDetail(data);
            } catch {
                setDetail(null);
            }
        };

        void fetchDetail();
    }, [selectedBook?.id]);

    const handleReserve = async (bookId?: number) => {
        const targetBookId = bookId ?? selectedBook?.id;
        if (!targetBookId) {
            return;
        }
        try {
            await submitBorrowRequest(targetBookId);
            await loadBooks();
            setError('');
            alert('Đã gửi yêu cầu mượn. Thủ thư sẽ xem xét và duyệt yêu cầu của bạn.');
        } catch {
            setError('Gửi yêu cầu mượn thất bại. Hãy đăng nhập lại và thử tiếp.');
        }
    };

    const handleJoinWaitlist = async (bookId: number) => {
        try {
            await joinBorrowingWaitlist(bookId);
            await loadBooks();
            setError('');
            alert('Đã tham gia hàng chờ thành công. Khi có sách, hệ thống sẽ thông báo cho bạn.');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = (err.response?.data as { message?: string } | undefined)?.message;
                setError(message || 'Không thể tham gia hàng chờ cho sách này.');
            } else {
                setError('Không thể tham gia hàng chờ cho sách này.');
            }
        }
    };

    return {
        books,
        home,
        detail,
        loading,
        error,
        search,
        setSearch,
        selectedBook,
        setSelectedBookId,
        loadBooks,
        handleReserve,
        handleJoinWaitlist,
    };
}
