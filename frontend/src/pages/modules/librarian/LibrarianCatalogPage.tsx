import { useOutletContext } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import type { LibrarianLayoutOutletContext } from './LibrarianLayout';

export default function LibrarianCatalogPage() {
    useOutletContext<LibrarianLayoutOutletContext>();
    return <Navigate to="books" replace />;
}

