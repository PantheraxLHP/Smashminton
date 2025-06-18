import { z } from "zod";

export const productSchema = z.object({
    name: z.string()
        .min(1, { message: "Tên dịch vụ không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Tên dịch vụ không hợp lệ" }),
    sellingprice: z
        .number()
        .min(0, { message: "Giá không hợp lệ" })
        .max(1000000000, { message: "Giá vượt quá giới hạn" })
        .refine((val) => val > 0, {
            message: "Giá không hợp lệ. Vui lòng nhập giá lớn hơn 0.",
        }),
});

export const verifyOrderSchema = z.object({
    receivedQuantity: z
        .number()
        .min(1, { message: "Số lượng giao phải lớn hơn 0" })
        .max(1000000000, { message: "Số lượng giao không hợp lệ" }),

    expiryDate: z
        .string()
        .refine((val) => new Date(val) >= new Date(), {
            message: "Ngày hết hạn không hợp lệ",
        }),
});

export const supplierSchema = z.object({
    name: z.string()
        .min(1, { message: "Tên nhà cung cấp không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Tên nhà cung cấp không hợp lệ" }),
    phone: z.string()
        .min(1, { message: "Số điện thoại không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Số điện thoại không hợp lệ" }),
    contactname: z.string()
        .min(1, { message: "Tên người liên hệ không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Tên người liên hệ không hợp lệ" }),
    email: z.string()
        .min(1, { message: "Địa chỉ Email không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Địa chỉ Email không hợp lệ" }),
    address: z.string()
        .min(1, { message: "Địa chỉ không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Địa chỉ không hợp lệ" }),
});