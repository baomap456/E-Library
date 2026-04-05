import { useOutletContext } from 'react-router-dom';
import LibrarianManagementTab from '../../../components/librarian/LibrarianManagementTab';
import type { LibrarianLayoutOutletContext } from './LibrarianLayout';

export default function LibrarianIncidentsPage() {
    const { managementTabProps } = useOutletContext<LibrarianLayoutOutletContext>();
    return <LibrarianManagementTab {...managementTabProps} view="incidents" />;
}

