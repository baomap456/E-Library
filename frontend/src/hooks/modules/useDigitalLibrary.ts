import { useEffect, useState } from 'react';
import { fetchDigitalDocuments, fetchReaderConfig } from '../../api/modules/digitalApi';
import type { DigitalDoc, ReaderConfig } from '../../types/modules/digital';

export function useDigitalLibrary() {
    const [docs, setDocs] = useState<DigitalDoc[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<DigitalDoc | null>(null);
    const [readerConfig, setReaderConfig] = useState<ReaderConfig | null>(null);
    const [filters, setFilters] = useState({ q: '', year: '2026' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDocs = async () => {
        const params: Record<string, string> = {};
        if (filters.q) params.q = filters.q;
        if (filters.year) params.publishYear = filters.year;

        const data = await fetchDigitalDocuments(params);
        setDocs(data);
        setSelectedDoc(data[0] || null);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadDocs();
            } catch {
                setError('Không thể tải danh mục tài liệu số.');
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchReader = async () => {
            if (!selectedDoc) {
                setReaderConfig(null);
                return;
            }
            try {
                const data = await fetchReaderConfig(selectedDoc.id);
                setReaderConfig(data);
            } catch {
                setReaderConfig(null);
            }
        };

        void fetchReader();
    }, [selectedDoc]);

    return {
        docs,
        selectedDoc,
        setSelectedDoc,
        readerConfig,
        filters,
        setFilters,
        loading,
        error,
        loadDocs,
    };
}
