import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Grid,
} from '@mui/material';
import CatalogBookDetailCard from '../../components/catalog/CatalogBookDetailCard';
import CatalogBooksGridCard from '../../components/catalog/CatalogBooksGridCard';
import CatalogFiltersCard from '../../components/catalog/CatalogFiltersCard';
import CatalogPageHeader from '../../components/catalog/CatalogPageHeader';
import CatalogQuickExploreCard from '../../components/catalog/CatalogQuickExploreCard';
import { useCatalogDiscovery } from '../../hooks/modules/useCatalogDiscovery';

export default function CatalogDiscovery() {
    const [bookPage, setBookPage] = useState(1);
    const booksPerPage = 6;

    const {
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
        handleJoinWaitlist,
    } = useCatalogDiscovery();

    const pagedBooks = useMemo(() => {
        const start = (bookPage - 1) * booksPerPage;
        return books.slice(start, start + booksPerPage);
    }, [books, bookPage]);

    const totalBookPages = Math.max(1, Math.ceil(books.length / booksPerPage));

    useEffect(() => {
        setBookPage(1);
    }, [books.length, search.q, search.author, search.category, search.publishYear, search.status]);

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <CatalogPageHeader />

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12 }}>
                    <CatalogQuickExploreCard
                        home={home}
                        query={search.q}
                        onQueryChange={(value) => setSearch((prev) => ({ ...prev, q: value }))}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <CatalogFiltersCard search={search} setSearch={setSearch} onApply={loadBooks} />
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <CatalogBookDetailCard
                        selectedBook={selectedBook}
                        detail={detail}
                        onReserve={handleReserve}
                        onJoinWaitlist={handleJoinWaitlist}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <CatalogBooksGridCard
                        books={books}
                        pagedBooks={pagedBooks}
                        booksPerPage={booksPerPage}
                        bookPage={bookPage}
                        totalBookPages={totalBookPages}
                        selectedBookId={selectedBook?.id}
                        onChangePage={setBookPage}
                        onSelectBook={setSelectedBookId}
                        onReserve={handleReserve}
                        onJoinWaitlist={handleJoinWaitlist}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
