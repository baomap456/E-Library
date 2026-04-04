import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { LibrarianDashboard } from '../../types/modules/librarian';
import type { ReportsKpi } from '../../types/modules/reports';

type Props = {
    dashboard: LibrarianDashboard | null;
    kpis?: ReportsKpi | null;
};

const CHART_COLORS = ['#10439f', '#f27b22', '#4CAF50', '#FF9800', '#2196F3', '#F44336'];

function Metric({ title, value }: { title: string; value: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(180deg, #ffffff, #eef4ff)',
                border: '1px solid #dde6fb',
            }}
        >
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
        </Box>
    );
}

export default function LibrarianDashboardMetrics({ dashboard, kpis }: Props) {
    const hasRevenueData = Boolean(kpis && (kpis.membershipRevenue > 0 || kpis.fineRevenue > 0));
    const hasCategoryData = Boolean(kpis && kpis.categoryDistribution.length > 0);
    const hasGrowthData = Boolean(kpis && kpis.newMembersByMonth.length > 0);
    const hasTopBorrowedData = Boolean(kpis && kpis.topBorrowedBooks.length > 0);
    const hasTopUnborrowedData = Boolean(kpis && kpis.topUnborrowedBooks.length > 0);

    return (
        <Grid container spacing={2.2}>
            {/* Existing Dashboard Metrics */}
            <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>Thống kê hôm nay</Typography>
                <Grid container spacing={1.2}>
                    <Grid size={{ xs: 12, sm: 4 }}><Metric title="Tổng sách" value={String(dashboard?.totalBooks || 0)} /></Grid>
                    <Grid size={{ xs: 12, sm: 4 }}><Metric title="Đang cho mượn" value={String(dashboard?.borrowingNow || 0)} /></Grid>
                    <Grid size={{ xs: 12, sm: 4 }}><Metric title="Lượt mượn hôm nay" value={String(dashboard?.borrowingsToday || 0)} /></Grid>
                </Grid>
            </Grid>

            {/* KPI Metrics from Inventory Reports */}
            {kpis ? (
                <>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>KPI Kinh doanh</Typography>
                        <Grid container spacing={1.2}>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <Metric 
                                    title="Tổng lượt mượn" 
                                    value={String(kpis.totalBorrows)} 
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <Metric 
                                    title="Tỷ lệ đang mượn" 
                                    value={`${(kpis.borrowingRate ?? 0).toFixed(2)}%`} 
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <Metric 
                                    title="Tỷ lệ quá hạn" 
                                    value={`${(kpis.overdueUserRate ?? 0).toFixed(2)}%`} 
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <Metric 
                                    title="Doanh thu membership" 
                                    value={`${(kpis.membershipRevenue ?? 0).toLocaleString('vi-VN')} VND`} 
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Revenue Chart */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>Doanh thu</Typography>
                                {hasRevenueData ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={[
                                            { name: 'Membership', value: kpis.membershipRevenue ?? 0 },
                                            { name: 'Tiền phạt', value: kpis.fineRevenue ?? 0 }
                                        ]} margin={{ top: 8, right: 8, left: 28, bottom: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis width={90} tickFormatter={(value) => Number(value).toLocaleString('vi-VN')} />
                                            <Tooltip formatter={(value) => [`${(value as number).toLocaleString('vi-VN')} VND`]} />
                                            <Bar dataKey="value" fill="#10439f" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Category Distribution Pie Chart */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>Phân bố thể loại</Typography>
                                {hasCategoryData ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={kpis.categoryDistribution}
                                                dataKey="bookCount"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {kpis.categoryDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Monthly User Growth Chart */}
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>Tăng trưởng thành viên mới</Typography>
                                {hasGrowthData ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={kpis.newMembersByMonth}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="newUsers"
                                                stroke="#10439f"
                                                strokeWidth={2}
                                                dot={{ fill: '#10439f', r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Books */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>Top 10 sách được mượn nhiều</Typography>
                                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {hasTopBorrowedData ? (
                                        kpis.topBorrowedBooks.map((book, index) => (
                                            <Box key={`top-${book.bookId}`} sx={{ py: 0.5, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">{index + 1}. {book.title}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{book.borrowCount}</Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Unborrowed Books */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>Top 10 sách không được mượn trong 1 năm</Typography>
                                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {hasTopUnborrowedData ? (
                                        kpis.topUnborrowedBooks.map((book, index) => (
                                            <Box key={`stale-${book.bookId}`} sx={{ py: 0.5, borderBottom: '1px solid #eee' }}>
                                                <Typography variant="body2">{index + 1}. {book.title}</Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </>
            ) : (
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2 }}>KPI Kinh doanh</Typography>
                            <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
}
