export interface paymentData {
    userId: string;
    userName: string;
    guestPhoneNumber?: string;
    paymentMethod?: string;
    voucherId?: string;
    totalAmount?: number;
}