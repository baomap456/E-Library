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

export interface ReportsExportResponse {
    downloadPath: string;
}
