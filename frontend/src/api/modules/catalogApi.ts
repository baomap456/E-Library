import axiosClient from '../axiosClient';
import type {
    CatalogBookDetailResponse,
    CatalogBookItem,
    CatalogHomeResponse,
    CatalogSearchParams,
} from '../../types/modules/catalog';

export function fetchCatalogHome() {
    return axiosClient.get<unknown, CatalogHomeResponse>('/catalog/home');
}

export function fetchCatalogBooks(params: CatalogSearchParams) {
    return axiosClient.get<unknown, CatalogBookItem[]>('/catalog/books', { params });
}

export function fetchCatalogBookDetail(bookId: number) {
    return axiosClient.get<unknown, CatalogBookDetailResponse>(`/catalog/books/${bookId}`);
}

export function reserveCatalogBook(bookId: number) {
    return axiosClient.post(`/catalog/books/${bookId}/reserve`, {});
}
