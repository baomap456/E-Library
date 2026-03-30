import { useEffect, useMemo, useState } from 'react';
import {
    fetchCatalogBookDetail,
    fetchCatalogBooks,
    fetchCatalogHome,
    reserveCatalogBook,
} from '../../api/modules/catalogApi';
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

    const handleReserve = async () => {
        if (!selectedBook?.id) {
            return;
        }
        try {
            await reserveCatalogBook(selectedBook.id);
            setError('');
            alert('Đã thêm vào giỏ đặt mượn.');
        } catch {
            setError('Đặt mượn thất bại. Hãy đăng nhập lại và thử tiếp.');
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
    };
}
