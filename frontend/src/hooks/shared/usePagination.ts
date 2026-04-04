import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

type RowsPerPageChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type UsePaginationOptions = Readonly<{
    storageKey?: string;
    initialPage?: number;
    initialRowsPerPage?: number;
    resetDeps?: readonly unknown[];
}>;

function readStoredNumber(key: string, fallback: number): number {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
        return fallback;
    }
    const value = Number.parseInt(raw, 10);
    return Number.isNaN(value) ? fallback : value;
}

export function usePagination<T>(items: T[], options?: UsePaginationOptions) {
    const initialPage = options?.initialPage ?? 0;
    const initialRowsPerPage = options?.initialRowsPerPage ?? 10;
    const storageKey = options?.storageKey;
    const resetDeps = options?.resetDeps;

    const [page, setPage] = useState(() => {
        if (!storageKey) {
            return initialPage;
        }
        return readStoredNumber(`${storageKey}:page`, initialPage);
    });

    const [rowsPerPage, setRowsPerPage] = useState(() => {
        if (!storageKey) {
            return initialRowsPerPage;
        }
        return readStoredNumber(`${storageKey}:rowsPerPage`, initialRowsPerPage);
    });

    const totalCount = items.length;
    const maxPage = Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1);

    useEffect(() => {
        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [page, maxPage]);

    useEffect(() => {
        if (!resetDeps) {
            return;
        }
        setPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, resetDeps);

    useEffect(() => {
        if (!storageKey) {
            return;
        }
        sessionStorage.setItem(`${storageKey}:page`, String(page));
        sessionStorage.setItem(`${storageKey}:rowsPerPage`, String(rowsPerPage));
    }, [storageKey, page, rowsPerPage]);

    const pagedItems = useMemo(
        () => items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [items, page, rowsPerPage],
    );

    const onPageChange = (_: unknown, nextPage: number) => {
        setPage(nextPage);
    };

    const onRowsPerPageChange = (event: RowsPerPageChangeEvent) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    return {
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalCount,
        pagedItems,
        onPageChange,
        onRowsPerPageChange,
    };
}