import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { fetchCatalogBooks } from '../../api/modules/catalogApi';
import { getStoredUser, hasRole } from '../../api/session';
import { submitBorrowRequest, joinBorrowingWaitlist } from '../../api/modules/borrowingApi';
import type { CatalogBookItem } from '../../types/modules/catalog';

export type BookListSearchState = {
    q: string;
    author: string;
    category: string;
    publishYear: string;
    status: string;
};

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

export function useBookList() {
    const currentUser = getStoredUser();
    const isStaff = hasRole(currentUser, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);

    const [books, setBooks] = useState<CatalogBookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState<BookListSearchState>({
        q: '',
        author: '',
        category: '',
        publishYear: '',
        status: 'available',
    });
    const [bookPage, setBookPage] = useState(1);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
    const [borrowSubmitting, setBorrowSubmitting] = useState(false);
    const [borrowDialogError, setBorrowDialogError] = useState('');
    const [queueNoticeOpen, setQueueNoticeOpen] = useState(false);
    const [queueNoticeMessage, setQueueNoticeMessage] = useState('');
    const [selectedBorrowBook, setSelectedBorrowBook] = useState<CatalogBookItem | null>(null);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const loadBooks = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchCatalogBooks({});
            setBooks(data);
            setSelectedBookId((previous) => previous ?? data[0]?.id ?? null);
        } catch {
            setError('Không thể tải danh sách sách.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadBooks();
    }, []);

    useEffect(() => {
        setBookPage(1);
    }, [search.q, search.author, search.category, search.publishYear, search.status]);

    const filteredBooks = useMemo(() => {
        const normalizedQuery = search.q.trim().toLowerCase();
        const normalizedAuthor = search.author.trim().toLowerCase();
        const normalizedCategory = search.category.trim().toLowerCase();
        const normalizedYear = search.publishYear.trim();
        const normalizedStatus = search.status.trim().toLowerCase();

        return books.filter((book) => {
            const matchesQuery = !normalizedQuery
                || book.title.toLowerCase().includes(normalizedQuery)
                || book.isbn.toLowerCase().includes(normalizedQuery)
                || book.author.some((author) => author.toLowerCase().includes(normalizedQuery));
            const matchesAuthor = !normalizedAuthor
                || book.author.some((author) => author.toLowerCase().includes(normalizedAuthor));
            const matchesCategory = !normalizedCategory || book.category.toLowerCase() === normalizedCategory;
            const matchesYear = !normalizedYear || String(book.publishYear) === normalizedYear;
            const matchesStatus = !normalizedStatus
                || (normalizedStatus === 'available' && book.availableItems > 0)
                || (normalizedStatus === 'unavailable' && book.availableItems <= 0);

            return matchesQuery && matchesAuthor && matchesCategory && matchesYear && matchesStatus;
        });
    }, [books, search.author, search.category, search.publishYear, search.q, search.status]);

    const booksPerPage = 10;
    const totalBookPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    const currentBookPage = Math.min(bookPage, totalBookPages);
    const pagedBooks = useMemo(() => {
        const start = (currentBookPage - 1) * booksPerPage;
        return filteredBooks.slice(start, start + booksPerPage);
    }, [currentBookPage, filteredBooks]);

    useEffect(() => {
        if (filteredBooks.length > 0 && (!selectedBookId || !filteredBooks.some((book) => book.id === selectedBookId))) {
            setSelectedBookId(filteredBooks[0].id);
        }
    }, [filteredBooks, selectedBookId]);

    const selectedBook = useMemo(
        () => filteredBooks.find((book) => book.id === selectedBookId) || filteredBooks[0] || null,
        [filteredBooks, selectedBookId],
    );

    useEffect(() => {
        if (selectedBook?.id && selectedBookId !== selectedBook.id) {
            setSelectedBookId(selectedBook.id);
        }
    }, [selectedBook, selectedBookId]);

    const categoryOptions = useMemo(() => {
        return Array.from(new Set(books.map((book) => book.category).filter(Boolean))).sort((left, right) => left.localeCompare(right));
    }, [books]);

    const previewBooks = useMemo(() => filteredBooks.slice(0, 3), [filteredBooks]);

    const openBorrowSlip = (book: CatalogBookItem) => {
        if (isStaff) {
            setError('Thủ thư không được mượn sách cho chính mình.');
            return;
        }
        if (book.pendingRequests > 0) {
            setQueueNoticeMessage('Sách này đã có người xếp hàng chờ. Bạn cần tham gia hàng đợi thay vì lập phiếu mượn ngay.');
            setQueueNoticeOpen(true);
            return;
        }
        const pickup = new Date();
        pickup.setDate(pickup.getDate() + 1);
        const ret = new Date();
        ret.setDate(ret.getDate() + 7);
        setSelectedBorrowBook(book);
        setPickupDate(pickup.toISOString().slice(0, 10));
        setReturnDate(ret.toISOString().slice(0, 10));
        setBorrowDialogError('');
        setBorrowDialogOpen(true);
    };

    const confirmBorrowSlip = async () => {
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
            setBorrowSubmitting(true);
            setBorrowDialogError('');
            await submitBorrowRequest(selectedBorrowBook.id, pickupDate, returnDate);
            await loadBooks();
            setBorrowDialogOpen(false);
            setSelectedBorrowBook(null);
            setError('');
        } catch (err: unknown) {
            setBorrowDialogError(resolveApiErrorMessage(err, 'Không thể gửi phiếu mượn.'));
        } finally {
            setBorrowSubmitting(false);
        }
    };

    const handleJoinWaitlist = async (bookId: number) => {
        if (isStaff) {
            setError('Thủ thư không được tham gia hàng chờ.');
            return;
        }
        try {
            await joinBorrowingWaitlist(bookId);
            await loadBooks();
            setError('');
        } catch (err: unknown) {
            setError(resolveApiErrorMessage(err, 'Không thể tham gia hàng chờ.'));
        }
    };

    return {
        books,
        loading,
        error,
        search,
        setSearch,
        booksPerPage,
        bookPage,
        setBookPage,
        selectedBook,
        setSelectedBookId,
        borrowDialogOpen,
        setBorrowDialogOpen,
        borrowSubmitting,
        borrowDialogError,
        queueNoticeOpen,
        setQueueNoticeOpen,
        queueNoticeMessage,
        selectedBorrowBook,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        filteredBooks,
        totalBookPages,
        currentBookPage,
        pagedBooks,
        categoryOptions,
        previewBooks,
        isStaff,
        openBorrowSlip,
        confirmBorrowSlip,
        handleJoinWaitlist,
    };
}