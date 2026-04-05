import { useEffect, useMemo, useState } from 'react';
import type { LibrarianAuthor, LibrarianBook, LibrarianCategory, LibrarianDebtor, LibrarianLocation } from '../../types/modules/librarian';
import type { BorrowRequestResponse } from '../../types/borrowing';
import { usePagination } from '../shared/usePagination';

function readStoredNumber(key: string, fallback: number): number {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
        return fallback;
    }
    const value = Number.parseInt(raw, 10);
    return Number.isNaN(value) ? fallback : value;
}

function readStoredString(key: string, fallback: string): string {
    const raw = sessionStorage.getItem(key);
    return raw ?? fallback;
}

interface UseLibrarianPanelUiStateParams {
    books: LibrarianBook[];
    debtors: LibrarianDebtor[];
    fineInvoices: unknown[];
    userFineSummaries: unknown[];
    requests: BorrowRequestResponse[];
    authors: LibrarianAuthor[];
    categories: LibrarianCategory[];
    locations: LibrarianLocation[];
    filterStatus: 'PENDING' | 'ALL';
}

export function useLibrarianPanelUiState(params: UseLibrarianPanelUiStateParams) {
    const { books, debtors, fineInvoices, userFineSummaries, requests, authors, categories, locations, filterStatus } = params;

    const [tabValue, setTabValue] = useState(() => readStoredNumber('librarian:tabValue', 0));
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [reviewNote, setReviewNote] = useState('');
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

    const [bookAvailableOnly, setBookAvailableOnly] = useState(() => readStoredString('librarian:bookAvailableOnly', 'true') === 'true');

    const [debtorOverdueOnly, setDebtorOverdueOnly] = useState(() => readStoredString('librarian:debtorOverdueOnly', 'false') === 'true');
    const [debtorSearch, setDebtorSearch] = useState(() => readStoredString('librarian:debtorSearch', ''));

    const [authorSearch, setAuthorSearch] = useState(() => readStoredString('librarian:authorSearch', ''));
    const [categorySearch, setCategorySearch] = useState(() => readStoredString('librarian:categorySearch', ''));
    const [locationSearch, setLocationSearch] = useState(() => readStoredString('librarian:locationSearch', ''));

    const filteredBooks = useMemo(() => {
        if (!bookAvailableOnly) {
            return books;
        }
        return books.filter((book) => book.availableCopies > 0);
    }, [books, bookAvailableOnly]);

    const bookPagination = usePagination(filteredBooks, {
        storageKey: 'librarian:books',
        initialRowsPerPage: 8,
        resetDeps: [filteredBooks.length, bookAvailableOnly],
    });

    const filteredDebtors = useMemo(() => {
        const q = debtorSearch.trim().toLowerCase();
        return debtors.filter((debtor) => {
            if (debtorOverdueOnly && !debtor.overdue) {
                return false;
            }
            if (!q) {
                return true;
            }
            const searchableText = `${debtor.fullName ?? ''} ${debtor.username}`.toLowerCase();
            return searchableText.includes(q);
        });
    }, [debtors, debtorOverdueOnly, debtorSearch]);

    const debtorPagination = usePagination(filteredDebtors, {
        storageKey: 'librarian:debtors',
        initialRowsPerPage: 5,
        resetDeps: [filteredDebtors.length, debtorOverdueOnly],
    });

    const requestPagination = usePagination(requests, {
        storageKey: 'librarian:requests',
        initialRowsPerPage: 5,
        resetDeps: [filterStatus, requests.length],
    });

    const filteredAuthors = useMemo(() => {
        const q = authorSearch.trim().toLowerCase();
        if (!q) {
            return authors;
        }
        return authors.filter((author) => author.name.toLowerCase().includes(q));
    }, [authors, authorSearch]);

    const authorPagination = usePagination(filteredAuthors, {
        storageKey: 'librarian:authors',
        initialRowsPerPage: 5,
        resetDeps: [filteredAuthors.length, authorSearch],
    });

    const filteredCategories = useMemo(() => {
        const q = categorySearch.trim().toLowerCase();
        if (!q) {
            return categories;
        }
        return categories.filter((category) => category.name.toLowerCase().includes(q));
    }, [categories, categorySearch]);

    const categoryPagination = usePagination(filteredCategories, {
        storageKey: 'librarian:categories',
        initialRowsPerPage: 5,
        resetDeps: [filteredCategories.length, categorySearch],
    });

    const filteredLocations = useMemo(() => {
        const q = locationSearch.trim().toLowerCase();
        if (!q) {
            return locations;
        }
        return locations.filter((location) => `${location.roomName} ${location.shelfNumber}`.toLowerCase().includes(q));
    }, [locations, locationSearch]);

    const locationPagination = usePagination(filteredLocations, {
        storageKey: 'librarian:locations',
        initialRowsPerPage: 5,
        resetDeps: [filteredLocations.length, locationSearch],
    });

    useEffect(() => {
        sessionStorage.setItem('librarian:tabValue', String(tabValue));
    }, [tabValue]);

    useEffect(() => {
        sessionStorage.setItem('librarian:bookAvailableOnly', String(bookAvailableOnly));
    }, [bookAvailableOnly]);

    useEffect(() => {
        sessionStorage.setItem('librarian:debtorOverdueOnly', String(debtorOverdueOnly));
    }, [debtorOverdueOnly]);

    useEffect(() => {
        sessionStorage.setItem('librarian:debtorSearch', debtorSearch);
    }, [debtorSearch]);

    useEffect(() => {
        sessionStorage.setItem('librarian:authorSearch', authorSearch);
    }, [authorSearch]);

    useEffect(() => {
        sessionStorage.setItem('librarian:categorySearch', categorySearch);
    }, [categorySearch]);

    useEffect(() => {
        sessionStorage.setItem('librarian:locationSearch', locationSearch);
    }, [locationSearch]);

    return {
        tabValue,
        setTabValue,
        selectedRequest,
        setSelectedRequest,
        reviewNote,
        setReviewNote,
        reviewAction,
        setReviewAction,

        bookPage: bookPagination.page,
        setBookPage: bookPagination.setPage,
        bookRowsPerPage: bookPagination.rowsPerPage,
        setBookRowsPerPage: bookPagination.setRowsPerPage,
        onBookPageChange: bookPagination.onPageChange,
        onBookRowsPerPageChange: bookPagination.onRowsPerPageChange,
        bookAvailableOnly,
        setBookAvailableOnly,
        filteredBooksCount: filteredBooks.length,
        pagedBooks: bookPagination.pagedItems,

        debtorPage: debtorPagination.page,
        setDebtorPage: debtorPagination.setPage,
        debtorRowsPerPage: debtorPagination.rowsPerPage,
        setDebtorRowsPerPage: debtorPagination.setRowsPerPage,
        onDebtorPageChange: debtorPagination.onPageChange,
        onDebtorRowsPerPageChange: debtorPagination.onRowsPerPageChange,
        debtorOverdueOnly,
        setDebtorOverdueOnly,
        debtorSearch,
        setDebtorSearch,
        fineInvoices,
        userFineSummaries,
        filteredDebtorsCount: filteredDebtors.length,
        pagedDebtors: debtorPagination.pagedItems,

        requestPage: requestPagination.page,
        setRequestPage: requestPagination.setPage,
        requestRowsPerPage: requestPagination.rowsPerPage,
        setRequestRowsPerPage: requestPagination.setRowsPerPage,
        onRequestPageChange: requestPagination.onPageChange,
        onRequestRowsPerPageChange: requestPagination.onRowsPerPageChange,
        pagedRequests: requestPagination.pagedItems,

        authorSearch,
        setAuthorSearch,
        authorPage: authorPagination.page,
        setAuthorPage: authorPagination.setPage,
        authorRowsPerPage: authorPagination.rowsPerPage,
        setAuthorRowsPerPage: authorPagination.setRowsPerPage,
        onAuthorPageChange: authorPagination.onPageChange,
        onAuthorRowsPerPageChange: authorPagination.onRowsPerPageChange,
        filteredAuthors,
        pagedAuthors: authorPagination.pagedItems,

        categorySearch,
        setCategorySearch,
        categoryPage: categoryPagination.page,
        setCategoryPage: categoryPagination.setPage,
        categoryRowsPerPage: categoryPagination.rowsPerPage,
        setCategoryRowsPerPage: categoryPagination.setRowsPerPage,
        onCategoryPageChange: categoryPagination.onPageChange,
        onCategoryRowsPerPageChange: categoryPagination.onRowsPerPageChange,
        filteredCategories,
        pagedCategories: categoryPagination.pagedItems,

        locationSearch,
        setLocationSearch,
        locationPage: locationPagination.page,
        setLocationPage: locationPagination.setPage,
        locationRowsPerPage: locationPagination.rowsPerPage,
        setLocationRowsPerPage: locationPagination.setRowsPerPage,
        onLocationPageChange: locationPagination.onPageChange,
        onLocationRowsPerPageChange: locationPagination.onRowsPerPageChange,
        filteredLocations,
        pagedLocations: locationPagination.pagedItems,
    };
}
