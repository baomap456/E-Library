import { useEffect, useMemo, useState } from 'react';
import type { LibrarianAuthor, LibrarianBook, LibrarianCategory, LibrarianDebtor, LibrarianLocation } from '../../types/modules/librarian';
import type { BorrowRequestResponse } from '../../types/borrowing';

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
    requests: BorrowRequestResponse[];
    authors: LibrarianAuthor[];
    categories: LibrarianCategory[];
    locations: LibrarianLocation[];
    filterStatus: 'PENDING' | 'ALL';
}

export function useLibrarianPanelUiState(params: UseLibrarianPanelUiStateParams) {
    const { books, debtors, requests, authors, categories, locations, filterStatus } = params;

    const [tabValue, setTabValue] = useState(() => readStoredNumber('librarian:tabValue', 0));
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [reviewNote, setReviewNote] = useState('');
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

    const [bookPage, setBookPage] = useState(() => readStoredNumber('librarian:bookPage', 0));
    const [bookRowsPerPage, setBookRowsPerPage] = useState(() => readStoredNumber('librarian:bookRowsPerPage', 8));

    const [debtorPage, setDebtorPage] = useState(() => readStoredNumber('librarian:debtorPage', 0));
    const [debtorRowsPerPage, setDebtorRowsPerPage] = useState(() => readStoredNumber('librarian:debtorRowsPerPage', 5));

    const [requestPage, setRequestPage] = useState(() => readStoredNumber('librarian:requestPage', 0));
    const [requestRowsPerPage, setRequestRowsPerPage] = useState(() => readStoredNumber('librarian:requestRowsPerPage', 5));

    const [authorPage, setAuthorPage] = useState(() => readStoredNumber('librarian:authorPage', 0));
    const [authorRowsPerPage, setAuthorRowsPerPage] = useState(() => readStoredNumber('librarian:authorRowsPerPage', 5));

    const [categoryPage, setCategoryPage] = useState(() => readStoredNumber('librarian:categoryPage', 0));
    const [categoryRowsPerPage, setCategoryRowsPerPage] = useState(() => readStoredNumber('librarian:categoryRowsPerPage', 5));

    const [locationPage, setLocationPage] = useState(() => readStoredNumber('librarian:locationPage', 0));
    const [locationRowsPerPage, setLocationRowsPerPage] = useState(() => readStoredNumber('librarian:locationRowsPerPage', 5));

    const [authorSearch, setAuthorSearch] = useState(() => readStoredString('librarian:authorSearch', ''));
    const [categorySearch, setCategorySearch] = useState(() => readStoredString('librarian:categorySearch', ''));
    const [locationSearch, setLocationSearch] = useState(() => readStoredString('librarian:locationSearch', ''));

    const pagedBooks = useMemo(
        () => books.slice(bookPage * bookRowsPerPage, bookPage * bookRowsPerPage + bookRowsPerPage),
        [books, bookPage, bookRowsPerPage],
    );

    const pagedDebtors = useMemo(
        () => debtors.slice(debtorPage * debtorRowsPerPage, debtorPage * debtorRowsPerPage + debtorRowsPerPage),
        [debtors, debtorPage, debtorRowsPerPage],
    );

    const pagedRequests = useMemo(
        () => requests.slice(requestPage * requestRowsPerPage, requestPage * requestRowsPerPage + requestRowsPerPage),
        [requests, requestPage, requestRowsPerPage],
    );

    const filteredAuthors = useMemo(() => {
        const q = authorSearch.trim().toLowerCase();
        if (!q) {
            return authors;
        }
        return authors.filter((author) => author.name.toLowerCase().includes(q));
    }, [authors, authorSearch]);

    const pagedAuthors = useMemo(
        () => filteredAuthors.slice(authorPage * authorRowsPerPage, authorPage * authorRowsPerPage + authorRowsPerPage),
        [filteredAuthors, authorPage, authorRowsPerPage],
    );

    const filteredCategories = useMemo(() => {
        const q = categorySearch.trim().toLowerCase();
        if (!q) {
            return categories;
        }
        return categories.filter((category) => category.name.toLowerCase().includes(q));
    }, [categories, categorySearch]);

    const pagedCategories = useMemo(
        () => filteredCategories.slice(categoryPage * categoryRowsPerPage, categoryPage * categoryRowsPerPage + categoryRowsPerPage),
        [filteredCategories, categoryPage, categoryRowsPerPage],
    );

    const filteredLocations = useMemo(() => {
        const q = locationSearch.trim().toLowerCase();
        if (!q) {
            return locations;
        }
        return locations.filter((location) => `${location.roomName} ${location.shelfNumber}`.toLowerCase().includes(q));
    }, [locations, locationSearch]);

    const pagedLocations = useMemo(
        () => filteredLocations.slice(locationPage * locationRowsPerPage, locationPage * locationRowsPerPage + locationRowsPerPage),
        [filteredLocations, locationPage, locationRowsPerPage],
    );

    useEffect(() => {
        setRequestPage(0);
    }, [filterStatus, requests.length]);

    useEffect(() => {
        setAuthorPage(0);
    }, [authors.length, authorSearch]);

    useEffect(() => {
        setCategoryPage(0);
    }, [categories.length, categorySearch]);

    useEffect(() => {
        setLocationPage(0);
    }, [locations.length, locationSearch]);

    useEffect(() => {
        sessionStorage.setItem('librarian:tabValue', String(tabValue));
    }, [tabValue]);

    useEffect(() => {
        sessionStorage.setItem('librarian:bookPage', String(bookPage));
        sessionStorage.setItem('librarian:bookRowsPerPage', String(bookRowsPerPage));
    }, [bookPage, bookRowsPerPage]);

    useEffect(() => {
        sessionStorage.setItem('librarian:debtorPage', String(debtorPage));
        sessionStorage.setItem('librarian:debtorRowsPerPage', String(debtorRowsPerPage));
    }, [debtorPage, debtorRowsPerPage]);

    useEffect(() => {
        sessionStorage.setItem('librarian:requestPage', String(requestPage));
        sessionStorage.setItem('librarian:requestRowsPerPage', String(requestRowsPerPage));
    }, [requestPage, requestRowsPerPage]);

    useEffect(() => {
        sessionStorage.setItem('librarian:authorPage', String(authorPage));
        sessionStorage.setItem('librarian:authorRowsPerPage', String(authorRowsPerPage));
        sessionStorage.setItem('librarian:authorSearch', authorSearch);
    }, [authorPage, authorRowsPerPage, authorSearch]);

    useEffect(() => {
        sessionStorage.setItem('librarian:categoryPage', String(categoryPage));
        sessionStorage.setItem('librarian:categoryRowsPerPage', String(categoryRowsPerPage));
        sessionStorage.setItem('librarian:categorySearch', categorySearch);
    }, [categoryPage, categoryRowsPerPage, categorySearch]);

    useEffect(() => {
        sessionStorage.setItem('librarian:locationPage', String(locationPage));
        sessionStorage.setItem('librarian:locationRowsPerPage', String(locationRowsPerPage));
        sessionStorage.setItem('librarian:locationSearch', locationSearch);
    }, [locationPage, locationRowsPerPage, locationSearch]);

    return {
        tabValue,
        setTabValue,
        selectedRequest,
        setSelectedRequest,
        reviewNote,
        setReviewNote,
        reviewAction,
        setReviewAction,

        bookPage,
        setBookPage,
        bookRowsPerPage,
        setBookRowsPerPage,
        pagedBooks,

        debtorPage,
        setDebtorPage,
        debtorRowsPerPage,
        setDebtorRowsPerPage,
        pagedDebtors,

        requestPage,
        setRequestPage,
        requestRowsPerPage,
        setRequestRowsPerPage,
        pagedRequests,

        authorSearch,
        setAuthorSearch,
        authorPage,
        setAuthorPage,
        authorRowsPerPage,
        setAuthorRowsPerPage,
        filteredAuthors,
        pagedAuthors,

        categorySearch,
        setCategorySearch,
        categoryPage,
        setCategoryPage,
        categoryRowsPerPage,
        setCategoryRowsPerPage,
        filteredCategories,
        pagedCategories,

        locationSearch,
        setLocationSearch,
        locationPage,
        setLocationPage,
        locationRowsPerPage,
        setLocationRowsPerPage,
        filteredLocations,
        pagedLocations,
    };
}
