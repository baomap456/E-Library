import axiosClient from '../axiosClient';
import type {
    CatalogBookDetailResponse,
    CatalogBookItem,
    CatalogHomeResponse,
    CatalogSearchParams,
} from '../../types/modules/catalog';

function normalizeCatalogBooks(data: unknown): CatalogBookItem[] {
    if (Array.isArray(data)) {
        return data as CatalogBookItem[];
    }

    if (data && typeof data === 'object') {
        const record = data as {
            content?: unknown;
            items?: unknown;
            data?: unknown;
        };

        if (Array.isArray(record.content)) {
            return record.content as CatalogBookItem[];
        }

        if (Array.isArray(record.items)) {
            return record.items as CatalogBookItem[];
        }

        if (Array.isArray(record.data)) {
            return record.data as CatalogBookItem[];
        }
    }

    return [];
}

export function fetchCatalogHome() {
    return axiosClient.get<unknown, CatalogHomeResponse>('/catalog/home');
}

export function fetchCatalogBooks(params: CatalogSearchParams) {
    return axiosClient.get<unknown, unknown>('/catalog/books', { params }).then(normalizeCatalogBooks);
}

export function fetchCatalogBookDetail(bookId: number) {
    return axiosClient.get<unknown, CatalogBookDetailResponse>(`/catalog/books/${bookId}`);
}

export function reserveCatalogBook(bookId: number) {
    return axiosClient.post(`/catalog/books/${bookId}/reserve`, {});
}
