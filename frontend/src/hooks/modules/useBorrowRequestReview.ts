import { useEffect, useState } from 'react';
import { getPendingBorrowRequests, getAllBorrowRequests, approveBorrowRequest, rejectBorrowRequest } from '../../api/modules/librarianApi';
import type { BorrowRequestResponse } from '../../types/borrowing';

export function useBorrowRequestReview() {
    const [requests, setRequests] = useState<BorrowRequestResponse[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState<'PENDING' | 'ALL'>('PENDING');

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = filterStatus === 'PENDING'
                ? await getPendingBorrowRequests()
                : await getAllBorrowRequests();
            setRequests(data);
            const pending = data.filter(r => r.status === 'PENDING').length;
            setPendingCount(pending);
            setError('');
        } catch (err) {
            setError('Không thể tải danh sách yêu cầu mượn');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadRequests();
    }, [filterStatus]);

    const handleApprove = async (requestId: number, note?: string) => {
        try {
            await approveBorrowRequest(requestId, note);
            await loadRequests();
        } catch (err) {
            setError('Không thể duyệt yêu cầu');
            console.error(err);
        }
    };

    const handleReject = async (requestId: number, note?: string) => {
        try {
            await rejectBorrowRequest(requestId, note);
            await loadRequests();
        } catch (err) {
            setError('Không thể từ chối yêu cầu');
            console.error(err);
        }
    };

    return {
        requests,
        pendingCount,
        loading,
        error,
        filterStatus,
        setFilterStatus,
        handleApprove,
        handleReject,
        loadRequests,
    };
}
