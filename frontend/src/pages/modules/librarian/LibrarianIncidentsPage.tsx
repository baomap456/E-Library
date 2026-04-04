import { useOutletContext } from 'react-router-dom';
import LibrarianManagementTab from '../../../components/librarian/LibrarianManagementTab';
import type { LibrarianPanelOutletContext } from '../LibrarianPanel';

export default function LibrarianIncidentsPage() {
    const { managementTabProps } = useOutletContext<LibrarianPanelOutletContext>();
    return <LibrarianManagementTab {...managementTabProps} view="incidents" />;
}
