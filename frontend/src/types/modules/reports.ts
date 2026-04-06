export interface ReportsDiscrepancy {
    title: string;
    systemCount: number;
    actualCount: number;
    difference: number;
}

export interface ReportsTrend {
    date: string;
    borrowCount: number;
}

export interface ReportsFinancial {
    period: string;
    paidFineRevenue: number;
    outstandingDebt: number;
    cardFeeRevenue: number;
}

export interface ReportsTopBookItem {
    bookId: number;
    title: string;
    borrowCount: number;
}

export interface ReportsCategoryShare {
    category: string;
    percentage: number;
    bookCount: number;
}

export interface ReportsMonthlyUserGrowth {
    month: string;
    newUsers: number;
}

export interface ReportsKpi {
    period: string;
    totalBorrows: number;
    borrowingRate: number;
    overdueUserRate: number;
    membershipRevenue: number;
    fineRevenue: number;
    topBorrowedBooks: ReportsTopBookItem[];
    topUnborrowedBooks: ReportsTopBookItem[];
    categoryDistribution: ReportsCategoryShare[];
    newMembersByMonth: ReportsMonthlyUserGrowth[];
}

export interface ReportsAuditLog {
    id: number;
    actor: string;
    action: string;
    targetType: string;
    targetId: string;
    details: string;
    createdAt: string;
}

export interface ReportsPhysicalAuditResponse {
    barcode: string;
    systemStatus: string;
    observedState: string;
    result: string;
    message: string;
}

export interface ReportsDigitalAuditItem {
    bookId: number;
    title: string;
    fileUrl: string;
    healthy: boolean;
    detail: string;
}

export interface ReportsDigitalAuditResponse {
    checkedCount: number;
    brokenCount: number;
    items: ReportsDigitalAuditItem[];
}

export interface ReportsDiscardBooksResponse {
    message: string;
    discardedBarcodes: string[];
    discardedCount: number;
    reportId: number;
    reportCode: string;
    reportCreatedAt: string;
    reportItems: ReportsDiscardReportItem[];
}

export interface ReportsDiscardReportItem {
    barcode: string;
    title: string;
    previousStatus: string;
    currentStatus: string;
    criteriaCode: string;
}

export interface ReportsDiscardSuggestion {
    barcode: string;
    title: string;
    status: string;
    criteriaCode: string;
    criteriaLabel: string;
    locationLabel: string;
    publishYear: number | null;
    borrowCount: number;
    lostDays: number | null;
}

export interface ReportsDiscardSuggestionsResponse {
    totalSuggestions: number;
    damagedSuggestions: number;
    lostOver365Suggestions: number;
    staleNoBorrowSuggestions: number;
    candidates: ReportsDiscardSuggestion[];
}

export interface ReportsDiscardReportSummary {
    reportId: number;
    reportCode: string;
    reason: string;
    discardedCount: number;
    createdAt: string;
}

export interface ReportsDiscardReportDetail {
    reportId: number;
    reportCode: string;
    reason: string;
    discardedCount: number;
    createdAt: string;
    items: ReportsDiscardReportItem[];
}

export interface ReportsExportResponse {
    message: string;
    format: string;
    downloadPath: string;
}

export interface ReportsInventorySession {
    id: number;
    name: string;
    area: string;
    createdAt: string;
    status?: string;
}

export interface ReportsInventoryBarcodeSearchResult {
    barcode: string;
    title: string;
    status: string;
    locationLabel: string;
}

export interface ReportsInventoryConflictItem {
    barcode: string;
    type: string;
    message: string;
    resolved: boolean;
}

export interface ReportsInventoryCloseResponse {
    sessionId: number;
    status: string;
    scannedCount: number;
    matchedCount: number;
    missingCount: number;
    conflictCount: number;
    missingBarcodes: string[];
    conflicts: ReportsInventoryConflictItem[];
    message: string;
}

export interface ReportsInventoryDetail {
    barcode: string;
    title: string;
    status: string;
    locationLabel: string;
    scannedAt: string;
}

export interface ReportsReconcileRequest {
    sessionId: number;
    barcode: string;
    actualQuantity: number;
}

export interface ReportsReconcileResponse {
    message: string;
    sessionId: number;
    barcode: string;
    actualQuantity: number;
}
