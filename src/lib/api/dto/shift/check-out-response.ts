export interface CheckOutResponse {
    shiftId: number;
    status: string;
    totalTransactions: number;
    checkedInAt: string;
    checkedOutAt: string;
}