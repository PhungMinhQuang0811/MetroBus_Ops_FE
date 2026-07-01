export interface ShiftResponse {
    id: number;
    accountId: string;
    stationId: number;
    stationCode: string;
    stationName: string;
    routeCode: string;
    status: string;
    totalTransactions: number;
    checkedInAt: string;
    checkedOutAt: string | null;
    createdAt: string;
}

export interface ShiftListResponse {
    items: ShiftResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}