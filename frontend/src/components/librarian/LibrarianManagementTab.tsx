import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
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
import type { LibrarianManagementContextValue } from './management/LibrarianManagementContext';

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

export default function LibrarianManagementTab(props: Readonly<LibrarianManagementContextValue>) {
    return (
        <LibrarianManagementProvider value={props}>
            <Grid container spacing={2.2} sx={{ mt: 0.1 }}>
                <Grid size={{ xs: 12 }}>
                    <LibrarianDashboardMetrics dashboard={props.dashboard} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Vận hành mượn trả"
                        description="Khu vực xử lý sách, tạo phiếu mượn, check-in/check-out và các tác vụ giao dịch trực tiếp."
                    >
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <BookCrudSection />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <CirculationActionsSection />
                            </Grid>
                        </Grid>
                    </SectionBlock>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Danh mục và cấu trúc thư viện"
                        description="Quản lý tác giả, thể loại và vị trí kệ để dữ liệu đầu sách luôn đồng nhất."
                    >
                        <Grid container spacing={1.5}>
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

                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Công nợ, sự cố và thư viện số"
                        description="Theo dõi bạn đọc chậm trả, xử lý mất/hỏng và quản lý tài nguyên số trong cùng một cụm riêng biệt."
                    >
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <DebtorFinesSection />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <IncidentReportSection />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <DigitalCrudSection />
                            </Grid>
                        </Grid>
                    </SectionBlock>
                </Grid>
            </Grid>
        </LibrarianManagementProvider>
    );
}
