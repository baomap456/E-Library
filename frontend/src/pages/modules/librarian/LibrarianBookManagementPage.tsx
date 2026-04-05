import { useOutletContext } from 'react-router-dom';
import LibrarianManagementTab from '../../../components/librarian/LibrarianManagementTab';
import type { LibrarianLayoutOutletContext } from './LibrarianLayout';

export default function LibrarianBookManagementPage() {
    const { managementTabProps } = useOutletContext<LibrarianLayoutOutletContext>();
    return <LibrarianManagementTab {...managementTabProps} view="catalog-books" />;
}
