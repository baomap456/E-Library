import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchCatalogBookDetail, fetchCatalogBooks } from '../../api/modules/catalogApi';
import { joinBorrowingWaitlist, submitBorrowRequest } from '../../api/modules/borrowingApi';
import { getStoredUser, hasRole } from '../../api/session';
import type { CatalogBookItem, CatalogBookDetailResponse } from '../../types/modules/catalog';

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

export function useBookDetail() {
    const params = useParams();
    const bookId = Number(params.bookId);
    const currentUser = getStoredUser();
    const isStaff = hasRole(currentUser, ['ROLE_LIBRARIAN', 'ROLE_ADMIN']);

    const [book, setBook] = useState<CatalogBookItem | null>(null);
    const [detail, setDetail] = useState<CatalogBookDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMessage, setActionMessage] = useState('');
    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
    const [borrowSubmitting, setBorrowSubmitting] = useState(false);
    const [borrowDialogError, setBorrowDialogError] = useState('');
    const [queueNoticeOpen, setQueueNoticeOpen] = useState(false);
    const [queueNoticeMessage, setQueueNoticeMessage] = useState('');
    const [pickupDate, setPickupDate] = useState(getDefaultPickupDate);
    const [returnDate, setReturnDate] = useState(getDefaultReturnDate);

    const loadBook = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [books, detailData] = await Promise.all([
                fetchCatalogBooks({}),
                fetchCatalogBookDetail(bookId),
            ]);
            setBook(books.find((item) => item.id === bookId) || null);
            setDetail(detailData);
        } catch {
            setError('Không thể tải thông tin sách.');
        } finally {
            setLoading(false);
        }
    }, [bookId]);

    useEffect(() => {
        if (!Number.isFinite(bookId)) {
            setError('Mã sách không hợp lệ.');
            setLoading(false);
            return;
        }
        void loadBook();
    }, [bookId, loadBook]);

    const authors = useMemo(() => book?.author.join(', ') || '', [book]);

    const openBorrowSlip = () => {
        if (!book) {
            return;
        }
        if (isStaff) {
            setActionMessage('Thủ thư không được mượn sách cho chính mình.');
            return;
        }
        if (book.pendingRequests > 0) {
            setQueueNoticeMessage('Sách này đã có người xếp hàng chờ. Bạn cần tham gia hàng đợi thay vì lập phiếu mượn ngay.');
            setQueueNoticeOpen(true);
            return;
        }
        setBorrowDialogError('');
        setBorrowDialogOpen(true);
        setPickupDate(getDefaultPickupDate());
        setReturnDate(getDefaultReturnDate());
    };

    const confirmBorrowSlip = async () => {
        if (!book) {
            return;
        }
        if (book.pendingRequests > 0) {
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
            await submitBorrowRequest(book.id, pickupDate, returnDate);
            await loadBook();
            setBorrowDialogOpen(false);
            setActionMessage('Đã gửi yêu cầu mượn sách.');
        } catch (err: unknown) {
            setBorrowDialogError(resolveApiErrorMessage(err, 'Không thể gửi phiếu mượn.'));
        } finally {
            setBorrowSubmitting(false);
        }
    };

    const handleJoinWaitlist = async () => {
        if (!book) {
            return;
        }
        if (isStaff) {
            setActionMessage('Thủ thư không được tham gia hàng chờ.');
            return;
        }
        try {
            const response = await joinBorrowingWaitlist(book.id);
            await loadBook();
            setActionMessage(`Bạn đang ở vị trí ${response.position} trong danh sách chờ.`);
        } catch (err: unknown) {
            setActionMessage(resolveApiErrorMessage(err, 'Không thể tham gia hàng chờ.'));
        }
    };

    return {
        book,
        detail,
        loading,
        error,
        actionMessage,
        borrowDialogOpen,
        setBorrowDialogOpen,
        borrowSubmitting,
        borrowDialogError,
        queueNoticeOpen,
        setQueueNoticeOpen,
        queueNoticeMessage,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        authors,
        isStaff,
        openBorrowSlip,
        confirmBorrowSlip,
        handleJoinWaitlist,
    };
}