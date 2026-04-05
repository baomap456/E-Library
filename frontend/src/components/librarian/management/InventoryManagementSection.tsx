import {
    Alert,
    Grid,
} from '@mui/material';
import { useInventoryReports } from '../../../hooks/modules/useInventoryReports';
import InventoryAuditLogCard from './inventory/InventoryAuditLogCard';
import InventoryDigitalAuditCard from './inventory/InventoryDigitalAuditCard';
import InventoryDiscrepancyCard from './inventory/InventoryDiscrepancyCard';
import InventoryDiscardCard from './inventory/InventoryDiscardCard';
import InventoryExportCard from './inventory/InventoryExportCard';
import InventoryPhysicalAuditCard from './inventory/InventoryPhysicalAuditCard';
import InventorySessionCard from './inventory/InventorySessionCard';
import InventoryTrendCard from './inventory/InventoryTrendCard';

export default function InventoryManagementSection() {
    const {
        sessionName,
        setSessionName,
        sessionArea,
        setSessionArea,
        period,
        setPeriod,
        discrepancies,
        trends,
        financial,
        auditLogs,
        auditBarcode,
        setAuditBarcode,
        auditObservedState,
        setAuditObservedState,
        auditNote,
        setAuditNote,
        lastPhysicalAudit,
        lastDigitalAudit,
        discardBookIdsRaw,
        setDiscardBookIdsRaw,
        discardReason,
        setDiscardReason,
        successMessage,
        handleCreateSession,
        handleRunPhysicalAudit,
        handleRunDigitalAudit,
        handleDiscardBooks,
        handleExport,
    } = useInventoryReports();

    return (
        <Grid container spacing={2.2}>
            {successMessage && <Grid size={{ xs: 12 }}><Alert severity="success">{successMessage}</Alert></Grid>}

            <Grid size={{ xs: 12, md: 5 }}>
                <InventorySessionCard
                    sessionName={sessionName}
                    sessionArea={sessionArea}
                    onSessionNameChange={setSessionName}
                    onSessionAreaChange={setSessionArea}
                    onCreateSession={() => void handleCreateSession()}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                <InventoryTrendCard trends={trends} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <InventoryPhysicalAuditCard
                    barcode={auditBarcode}
                    observedState={auditObservedState}
                    note={auditNote}
                    lastAudit={lastPhysicalAudit}
                    onBarcodeChange={setAuditBarcode}
                    onObservedStateChange={setAuditObservedState}
                    onNoteChange={setAuditNote}
                    onRunAudit={() => void handleRunPhysicalAudit()}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <InventoryDigitalAuditCard
                    financial={financial}
                    lastAudit={lastDigitalAudit}
                    onRunAudit={() => void handleRunDigitalAudit()}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <InventoryDiscrepancyCard discrepancies={discrepancies} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <InventoryDiscardCard
                    discardBookIdsRaw={discardBookIdsRaw}
                    discardReason={discardReason}
                    onDiscardBookIdsRawChange={setDiscardBookIdsRaw}
                    onDiscardReasonChange={setDiscardReason}
                    onDiscardBooks={() => void handleDiscardBooks()}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <InventoryExportCard
                    period={period}
                    onPeriodChange={setPeriod}
                    onExport={(format) => void handleExport(format)}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <InventoryAuditLogCard auditLogs={auditLogs} />
            </Grid>
        </Grid>
    );
}
