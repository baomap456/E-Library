import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    cancelBorrowRequest,
    fetchBorrowingData,
    fetchMyWaitlist,
    fetchMyProfileForBorrowing,
    getMyBorrowRequests,
    joinBorrowingWaitlist,
    renewBorrowingRecord,
    submitBorrowRequest,
} from '../../api/modules/borrowingApi';
import { fetchCatalogBooks } from '../../api/modules/catalogApi';
import { getStoredUser } from '../../api/session';
import type {
    BorrowingCartItem,
    BorrowingFinesResponse,
    BorrowingRecord,
    BorrowingWaitlistItem,
} from '../../types/modules/borrowing';
import type { CatalogBookItem } from '../../types/modules/catalog';
import type { ProfileResponse } from '../../types/modules/authPersonal';
import type { BorrowRequestResponse } from '../../types/borrowing';

export function useBorrowingReservation() {
    const [cart, setCart] = useState<BorrowingCartItem[]>([]);
    const [records, setRecords] = useState<BorrowingRecord[]>([]);
    const [fines, setFines] = useState<BorrowingFinesResponse | null>(null);
    const [waitlist, setWaitlist] = useState<BorrowingWaitlistItem[]>([]);
    const [books, setBooks] = useState<CatalogBookItem[]>([]);
    const [myRequests, setMyRequests] = useState<BorrowRequestResponse[]>([]);
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [requestedPickupDate, setRequestedPickupDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
    });
    const [requestedReturnDate, setRequestedReturnDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().slice(0, 10);
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const activeRecords = useMemo(() => records.filter((r) => !r.returnDate), [records]);
    const activeBorrowRequestCount = useMemo(
        () => myRequests.filter((r) => r.status === 'PENDING' || r.status === 'APPROVED').length,
        [myRequests],
    );
    const activeBorrowLoad = activeRecords.length + activeBorrowRequestCount;
    const membershipMaxBooks = profile?.membershipMaxBooks ?? 0;
    const reachedMembershipLimit = membershipMaxBooks > 0 && activeBorrowLoad >= membershipMaxBooks;
    const membershipLimitMessage = reachedMembershipLimit
        ? `Bạn đã đạt giới hạn gói (${activeBorrowLoad}/${membershipMaxBooks}). Không thể lập thêm phiếu mượn.`
        : '';

    const loadData = async () => {
        const user = getStoredUser();
        const [data, catalogBooks, requests, waitlistData, profileData] = await Promise.all([
            fetchBorrowingData(),
            fetchCatalogBooks({}),
            user?.username ? getMyBorrowRequests(user.username) : Promise.resolve([]),
            fetchMyWaitlist(),
            fetchMyProfileForBorrowing(),
        ]);
        setCart(data.cart);
        setRecords(data.records);
        setFines(data.fines);
        setBooks(catalogBooks);
        setMyRequests(requests);
        setWaitlist(waitlistData);
        setProfile(profileData);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadData();
            } catch {
                setError('Không thể tải dữ liệu mượn trả.');
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, []);

    const handleRenew = async (recordId: number) => {
        try {
            await renewBorrowingRecord(recordId);
            await loadData();
        } catch {
            setError('Gia hạn thất bại.');
        }
    };

    const handleCreateBorrowRequest = async (bookId: number) => {
        if (reachedMembershipLimit) {
            setError(membershipLimitMessage);
            return;
        }
        try {
            await submitBorrowRequest(bookId, requestedPickupDate, requestedReturnDate);
            setError('');
            await loadData();
            alert('Đã lập phiếu mượn, vui lòng chờ thủ thư duyệt.');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = (err.response?.data as { message?: string } | undefined)?.message;
                setError(message || 'Không thể lập phiếu mượn cho sách này.');
            } else {
                setError('Không thể lập phiếu mượn cho sách này.');
            }
        }
    };

    const handleJoinWaitlist = async (bookId: number) => {
        try {
            await joinBorrowingWaitlist(bookId);
            setError('');
            await loadData();
            alert('Đã tham gia hàng chờ thành công.');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = (err.response?.data as { message?: string } | undefined)?.message;
                setError(message || 'Không thể tham gia hàng chờ cho sách này.');
            } else {
                setError('Không thể tham gia hàng chờ cho sách này.');
            }
        }
    };

    const handleCancelRequest = async (requestId: number) => {
        try {
            await cancelBorrowRequest(requestId);
            setError('');
            await loadData();
            alert('Đã hủy phiếu mượn đang chờ duyệt.');
        } catch {
            setError('Không thể hủy phiếu mượn này.');
        }
    };

    return {
        cart,
        records,
        fines,
        books,
        requestedPickupDate,
        setRequestedPickupDate,
        requestedReturnDate,
        setRequestedReturnDate,
        waitlist,
        myRequests,
        loading,
        error,
        activeRecords,
        reachedMembershipLimit,
        membershipLimitMessage,
        handleRenew,
        handleCreateBorrowRequest,
        handleJoinWaitlist,
        handleCancelRequest,
    };
}
