import { useOutletContext } from 'react-router-dom';
import LibrarianManagementTab from '../../../components/librarian/LibrarianManagementTab';
import type { LibrarianPanelOutletContext } from '../LibrarianPanel';

export default function LibrarianInventoryPage() {
    const managementTabProps = useOutletContext<LibrarianPanelOutletContext>()?.managementTabProps;

    if (!managementTabProps) {
        return null;
    }

    return <LibrarianManagementTab view="inventory" {...managementTabProps} />;
}
