import { useOutletContext } from 'react-router-dom';
import LibrarianBorrowRequestsTab from '../../../components/librarian/LibrarianBorrowRequestsTab';
import type { LibrarianPanelOutletContext } from '../LibrarianPanel';

export default function LibrarianRequestsPage() {
    const { borrowRequestsTabProps } = useOutletContext<LibrarianPanelOutletContext>();
    return <LibrarianBorrowRequestsTab {...borrowRequestsTabProps} />;
}
