import { useOutletContext } from 'react-router-dom';
import LibrarianManagementTab from '../../../components/librarian/LibrarianManagementTab';
import type { LibrarianLayoutOutletContext } from './LibrarianLayout';

export default function LibrarianInventoryPage() {
    const managementTabProps = useOutletContext<LibrarianLayoutOutletContext>()?.managementTabProps;

    if (!managementTabProps) {
        return null;
    }

    return <LibrarianManagementTab view="inventory" {...managementTabProps} />;
}

