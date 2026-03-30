import { useEffect, useMemo, useState } from 'react';
import {
    fetchBorrowingData,
    joinBorrowingWaitlist,
    renewBorrowingRecord,
} from '../../api/modules/borrowingApi';
import type {
    BorrowingCartItem,
    BorrowingFinesResponse,
    BorrowingRecord,
} from '../../types/modules/borrowing';

export function useBorrowingReservation() {
    const [cart, setCart] = useState<BorrowingCartItem[]>([]);
    const [records, setRecords] = useState<BorrowingRecord[]>([]);
    const [fines, setFines] = useState<BorrowingFinesResponse | null>(null);
    const [waitBookId, setWaitBookId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const activeRecords = useMemo(() => records.filter((r) => !r.returnDate), [records]);

    const loadData = async () => {
        const data = await fetchBorrowingData();
        setCart(data.cart);
        setRecords(data.records);
        setFines(data.fines);
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

    const handleJoinWaitlist = async () => {
        if (!waitBookId) {
            return;
        }
        try {
            await joinBorrowingWaitlist(Number(waitBookId));
            setError('');
            alert('Đã tham gia hàng chờ thành công.');
        } catch {
            setError('Không thể tham gia hàng chờ.');
        }
    };

    return {
        cart,
        records,
        fines,
        waitBookId,
        setWaitBookId,
        loading,
        error,
        activeRecords,
        handleRenew,
        handleJoinWaitlist,
    };
}
