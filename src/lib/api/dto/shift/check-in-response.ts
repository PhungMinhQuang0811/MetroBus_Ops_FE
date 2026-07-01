export interface CheckInResponse {
    shiftId: number;
    accountId: string;
    stationId: number;
    stationName: string;
    status: string;
    checkedInAt: string;
}