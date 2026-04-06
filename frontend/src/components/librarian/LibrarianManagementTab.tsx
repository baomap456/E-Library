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
import ReturnBorrowRecordSection from './management/ReturnBorrowRecordSection';
import LibrarianDashboardMetrics from './LibrarianDashboardMetrics';
import InventoryManagementSection from './management/InventoryManagementSection';
import type { LibrarianManagementContextValue } from './management/LibrarianManagementContext';
import type { ReportsKpi } from '../../types/modules/reports';

export type LibrarianManagementView =
    | 'dashboard'
    | 'circulation'
    | 'circulation-borrow'
    | 'circulation-return'
    | 'catalog'
    | 'catalog-books'
    | 'catalog-authors'
    | 'catalog-categories'
    | 'catalog-locations'
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
                        title="Mượn sách"
                        description="Khu vực lập phiếu mượn trực tiếp cho bạn đọc hoặc khách tại quầy."
                    >
                        <CirculationActionsSection mode="borrow" />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'circulation-borrow') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Mượn sách"
                        description="Khu vực lập phiếu mượn trực tiếp cho bạn đọc hoặc khách tại quầy."
                    >
                        <CirculationActionsSection mode="borrow" />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'circulation-return') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Trả sách"
                        description="Check-in sách trả về bằng barcode và cập nhật trạng thái bản sách ngay lập tức."
                    >
                        <ReturnBorrowRecordSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'catalog') {
            return (
                <>
                    <Grid size={{ xs: 12 }}>
                        <SectionBlock
                            title="Quản lý sách"
                            description="Thêm, sửa, xóa đầu sách bằng form riêng và hiển thị danh sách theo bảng phân trang."
                        >
                            <BookCrudSection />
                        </SectionBlock>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <SectionBlock
                            title="Quản lý tác giả"
                            description="Tổ chức danh mục tác giả với form CRUD dạng hộp thoại và bảng phân trang."
                        >
                            <AuthorCrudSection />
                        </SectionBlock>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <SectionBlock
                            title="Quản lý danh mục"
                            description="Quản lý thể loại sách bằng form thêm/sửa/xóa và bảng dữ liệu phân trang."
                        >
                            <CategoryCrudSection />
                        </SectionBlock>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <SectionBlock
                            title="Quản lý vị trí sách"
                            description="Theo dõi phòng, kệ đặt sách với thao tác CRUD qua form và bảng phân trang."
                        >
                            <LocationCrudSection />
                        </SectionBlock>
                    </Grid>
                </>
            );
        }

        if (view === 'catalog-books') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Quản lý sách"
                        description="Thêm, sửa, xoá đầu sách bằng form riêng và hiển thị danh sách theo bảng phân trang."
                    >
                        <BookCrudSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'catalog-authors') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Quản lý tác giả"
                        description="Tổ chức danh mục tác giả với form CRUD dạng hộp thoại và bảng phân trang."
                    >
                        <AuthorCrudSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'catalog-categories') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Quản lý danh mục"
                        description="Quản lý thể loại sách bằng form thêm/sửa/xoá và bảng dữ liệu phân trang."
                    >
                        <CategoryCrudSection />
                    </SectionBlock>
                </Grid>
            );
        }

        if (view === 'catalog-locations') {
            return (
                <Grid size={{ xs: 12 }}>
                    <SectionBlock
                        title="Quản lý vị trí sách"
                        description="Theo dõi phòng, kệ đặt sách với thao tác CRUD qua form và bảng phân trang."
                    >
                        <LocationCrudSection />
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
                    title="Quản lý người dùng"
                    description="Tạo tài khoản, nâng cấp thành viên và theo dõi danh sách bạn đọc trong một nơi."
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
