import { useEffect, useState } from 'react';
import { getPendingBorrowRequests, getAllBorrowRequests, approveBorrowRequest, rejectBorrowRequest } from '../../api/modules/librarianApi';
import type { BorrowRequestResponse } from '../../types/borrowing';

export function useBorrowRequestReview() {
    const [allRequests, setAllRequests] = useState<BorrowRequestResponse[]>([]);
    const [requests, setRequests] = useState<BorrowRequestResponse[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState<'PENDING' | 'ALL'>('ALL');
    const [requestTypeFilter, setRequestTypeFilter] = useState<'ALL' | 'BORROW' | 'RENEWAL'>('ALL');
    const [sourceFilter, setSourceFilter] = useState<'ALL' | 'REQUEST' | 'DESK'>('ALL');

    const applyClientFilters = (
        source: BorrowRequestResponse[],
        typeFilter: 'ALL' | 'BORROW' | 'RENEWAL',
        requestSourceFilter: 'ALL' | 'REQUEST' | 'DESK',
    ) => {
        const typeFiltered = typeFilter === 'ALL'
            ? source
            : source.filter((item) => (item.requestType ?? 'BORROW') === typeFilter);

        if (requestSourceFilter === 'ALL') {
            return typeFiltered;
        }

        return typeFiltered.filter((item) => (item.source ?? 'REQUEST') === requestSourceFilter);
    };

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = filterStatus === 'PENDING'
                ? await getPendingBorrowRequests()
                : await getAllBorrowRequests();
            setAllRequests(data);
            setRequests(applyClientFilters(data, requestTypeFilter, sourceFilter));
            const pending = data.filter(r => r.status === 'PENDING').length;
            setPendingCount(pending);
            setError('');
        } catch (err) {
            setError('Không thể tải danh sách yêu cầu');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadRequests();
    }, [filterStatus]);

    useEffect(() => {
        setRequests(applyClientFilters(allRequests, requestTypeFilter, sourceFilter));
    }, [allRequests, requestTypeFilter, sourceFilter]);

    const handleApprove = async (requestId: number, note?: string) => {
        try {
            await approveBorrowRequest(requestId, note);
            await loadRequests();
        } catch (err) {
            setError('Không thể duyệt yêu cầu này');
            console.error(err);
        }
    };

    const handleReject = async (requestId: number, note?: string) => {
        try {
            await rejectBorrowRequest(requestId, note);
            await loadRequests();
        } catch (err) {
            setError('Không thể từ chối yêu cầu này');
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
        requestTypeFilter,
        setRequestTypeFilter,
        sourceFilter,
        setSourceFilter,
        handleApprove,
        handleReject,
        loadRequests,
    };
}
