import { Alert, Grid } from '@mui/material';
import InventoryAuditLogCard from '../../../components/librarian/management/inventory/InventoryAuditLogCard';
import InventoryDigitalAuditCard from '../../../components/librarian/management/inventory/InventoryDigitalAuditCard';
import InventoryDiscrepancyCard from '../../../components/librarian/management/inventory/InventoryDiscrepancyCard';
import InventoryDiscardCard from '../../../components/librarian/management/inventory/InventoryDiscardCard';
import InventoryExportCard from '../../../components/librarian/management/inventory/InventoryExportCard';
import { useInventoryReports } from '../../../hooks/modules/useInventoryReports';

export type LibrarianInventoryFeature =
    | 'digital-audit'
    | 'discrepancies'
    | 'discard'
    | 'export'
    | 'audit-logs';

interface LibrarianInventoryFeaturePageProps {
    feature: LibrarianInventoryFeature;
}

export default function LibrarianInventoryFeaturePage({ feature }: Readonly<LibrarianInventoryFeaturePageProps>) {
    const {
        period,
        setPeriod,
        discrepancies,
        financial,
        auditLogs,
        lastDigitalAudit,
        discardBarcodesRaw,
        setDiscardBarcodesRaw,
        discardReason,
        setDiscardReason,
        discardSuggestions,
        discardSuggestionSummary,
        lastDiscardReport,
        discardReportHistory,
        selectedDiscardReportDetail,
        successMessage,
        handleRunDigitalAudit,
        handleDiscardBooks,
        handleUseSuggestedBarcodes,
        handleOpenDiscardReportDetail,
        handleCloseDiscardReportDetail,
        handleExport,
    } = useInventoryReports();

    return (
        <Grid container spacing={2.2}>
            {successMessage && <Grid size={{ xs: 12 }}><Alert severity="success">{successMessage}</Alert></Grid>}

            {feature === 'digital-audit' && (
                <Grid size={{ xs: 12, md: 8 }}>
                    <InventoryDigitalAuditCard
                        financial={financial}
                        lastAudit={lastDigitalAudit}
                        onRunAudit={() => void handleRunDigitalAudit()}
                    />
                </Grid>
            )}

            {feature === 'discrepancies' && (
                <Grid size={{ xs: 12 }}>
                    <InventoryDiscrepancyCard discrepancies={discrepancies} />
                </Grid>
            )}

            {feature === 'discard' && (
                <Grid size={{ xs: 12, md: 8 }}>
                    <InventoryDiscardCard
                        discardBarcodesRaw={discardBarcodesRaw}
                        discardReason={discardReason}
                        discardSuggestions={discardSuggestions}
                        discardSuggestionSummary={discardSuggestionSummary}
                        lastDiscardReport={lastDiscardReport}
                        discardReportHistory={discardReportHistory}
                        selectedDiscardReportDetail={selectedDiscardReportDetail}
                        onDiscardBarcodesRawChange={setDiscardBarcodesRaw}
                        onDiscardReasonChange={setDiscardReason}
                        onUseSuggestedBarcodes={handleUseSuggestedBarcodes}
                        onOpenDiscardReportDetail={(reportId) => void handleOpenDiscardReportDetail(reportId)}
                        onCloseDiscardReportDetail={handleCloseDiscardReportDetail}
                        onDiscardBooks={() => void handleDiscardBooks()}
                    />
                </Grid>
            )}

            {feature === 'export' && (
                <Grid size={{ xs: 12, md: 7 }}>
                    <InventoryExportCard
                        period={period}
                        onPeriodChange={setPeriod}
                        onExport={(format) => void handleExport(format)}
                    />
                </Grid>
            )}

            {feature === 'audit-logs' && (
                <Grid size={{ xs: 12 }}>
                    <InventoryAuditLogCard auditLogs={auditLogs} />
                </Grid>
            )}
        </Grid>
    );
}
