export interface CatalogBookItem {
    id: number;
    title: string;
    isbn: string;
    author: string[];
    category: string;
    publishYear: number;
    coverImageUrl: string;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    availableItems: number;
    digital: boolean;
}

export interface CatalogHomeResponse {
    searchPlaceholder: string;
    newArrivals: Array<{ id: number; title: string }>;
    mostBorrowed: Array<{ id: number; title: string }>;
    banners: string[];
}

export interface CatalogBookDetailResponse {
    description: string;
    location: string;
}

export interface CatalogSearchParams {
    q?: string;
    author?: string;
    category?: string;
    publishYear?: string;
    status?: string;
}
