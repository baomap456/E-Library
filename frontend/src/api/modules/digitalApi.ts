import axiosClient from '../axiosClient';
import type { DigitalDoc, ReaderConfig } from '../../types/modules/digital';

export function fetchDigitalDocuments(params: { q?: string; publishYear?: string }) {
    return axiosClient.get<unknown, DigitalDoc[]>('/digital/documents', { params });
}

export function fetchReaderConfig(bookId: number) {
    return axiosClient.get<unknown, ReaderConfig>(`/digital/documents/${bookId}/reader-config`);
}
