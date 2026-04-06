import { useOutletContext } from 'react-router-dom';
import LibrarianBorrowRequestsTab from '../../../components/librarian/LibrarianBorrowRequestsTab';
import type { LibrarianLayoutOutletContext } from './LibrarianLayout';

export default function LibrarianRequestsPage() {
    const { borrowRequestsTabProps } = useOutletContext<LibrarianLayoutOutletContext>();
    return <LibrarianBorrowRequestsTab {...borrowRequestsTabProps} />;
}

