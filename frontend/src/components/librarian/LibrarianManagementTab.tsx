import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import AccountManagementSection from './management/AccountManagementSection';
import AuthorCrudSection from './management/AuthorCrudSection';
import BookCrudSection from './management/BookCrudSection';
import CategoryCrudSection from './management/CategoryCrudSection';
import CirculationActionsSection from './management/CirculationActionsSection';
import DebtorFinesSection from './management/DebtorFinesSection';
import DigitalCrudSection from './management/DigitalCrudSection';
import IncidentReportSection from './management/IncidentReportSection';
import { LibrarianManagementProvider } from './management/LibrarianManagementContext';
import LocationCrudSection from './management/LocationCrudSection';
import LibrarianDashboardMetrics from './LibrarianDashboardMetrics';
import InventoryManagementSection from './management/InventoryManagementSection';
import type { LibrarianManagementContextValue } from './management/LibrarianManagementContext';
import type { ReportsKpi } from '../../types/modules/reports';

export type LibrarianManagementView =
    | 'dashboard'
    | 'circulation'
    | 'catalog'
    | 'debtors'
    | 'incidents'
    | 'digital'
    | 'accounts'
    | 'inventory';

function SectionBlock({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {title}
                    </Typography>
                    <Typography color="text.secondary">
                        {description}
                    </Typography>
                </Stack>
                {children}
            </CardContent>
        </Card>
    );
}

interface LibrarianManagementTabProps extends LibrarianManagementContextValue {
    view: LibrarianManagementView;
    kpis?: ReportsKpi | null;
}

export default function LibrarianManagementTab({ view, ...props }: Readonly<LibrarianManagementTabProps>) {
    const renderContent = () => {
        if (view === 'dashboard') {
            return (
                <Grid size={{ xs: 12 }}>
                    <LibrarianDashboardMetrics dashboard={props.dashboard} kpis={props.kpis} />
                </Grid>
            );
        }

        if (view === 'circulation') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Vận hành mượn trả"
                        description="Khu vực tạo phiếu mượn, check-in/check-out và các tác vụ giao dịch trực tiếp."
                    >
                        <CirculationActionsSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'catalog') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Quản lý đầu sách"
                        description="Quản lý tác giả, thể loại và vị trí kệ để dữ liệu đầu sách luôn đồng nhất."
                    >
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12 }}>
                                <BookCrudSection />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <AuthorCrudSection />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <CategoryCrudSection />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <LocationCrudSection />
                            </Grid>
                        </Grid>
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'debtors') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Quản lý công nợ"
                        description="Theo dõi bạn đọc chậm trả và xử lý thanh toán phí phạt từng phần."
                    >
                        <DebtorFinesSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'incidents') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Biên bản sự cố"
                        description="Ghi nhận mất/hỏng theo phiếu mượn và theo dõi xử lý bồi thường."
                    >
                        <IncidentReportSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'digital') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Tài liệu số"
                        description="Quản lý kho tài nguyên số phục vụ bạn đọc trên hệ thống."
                    >
                        <DigitalCrudSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'inventory') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Báo cáo kho"
                        description="Kiểm kê vật lý/số, theo dõi chênh lệch kho, audit log, và thanh lý sách."
                    >
                        <InventoryManagementSection />
                    </SectionBlock>
                </Grid>
            );
        }

        return (
            <Grid size={{ xs: 12 }}>
                <SectionBlock
                    title="Tài khoản thành viên"
                    description="Tạo nhanh tài khoản và nâng cấp gói thành viên ngay trong panel."
                >
                    <AccountManagementSection />
                </SectionBlock>
            </Grid>
        );
    };

    return (
        <LibrarianManagementProvider value={props}>
            <Grid container spacing={2.2} sx={{ mt: 0.1 }}>
                {renderContent()}
            </Grid>
        </LibrarianManagementProvider>
    );
}
