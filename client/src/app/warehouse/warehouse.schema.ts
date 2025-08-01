import { z } from "zod";

export const productSchema = z.object({
    name: z.string()
        .min(1, { message: "Tên không hợp lệ" })
        .max(512, { message: "Tên không hợp lệ" }),
    sellingprice: z
        .number()
        .min(0, { message: "Giá không hợp lệ" })
        .max(1000000000, { message: "Giá vượt quá giới hạn" })
        .refine((val) => val > 0, {
            message: "Giá không hợp lệ. Vui lòng nhập giá lớn hơn 0.",
        }),
    discount: z
        .number()
        .min(0, { message: "Giảm giá không hợp lệ" })
        .max(100, { message: "Giảm giá không hợp lệ" }) 
        .refine((val) => val >= 0, {
            message: "Giảm giá không hợp lệ. Vui lòng nhập từ 0 tới 100",
        }),
});

export const accessorySchema = z.object({
    name: z.string()
        .min(1, { message: "Tên không hợp lệ" })
        .max(512, { message: "Tên không hợp lệ" }),
    sellingprice: z
        .number()
        .min(0, { message: "Giá không hợp lệ" })
        .max(1000000000, { message: "Giá vượt quá giới hạn" })
        .refine((val) => val > 0, {
            message: "Giá không hợp lệ. Vui lòng nhập giá lớn hơn 0.",
        })
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
        .max(512, { message: "Tên nhà cung cấp không hợp lệ" }),
    phone: z.string()
        .min(1, { message: "Số điện thoại không hợp lệ" })
        .regex(/^[0-9]/, { message: "Số điện thoại không hợp lệ" }),
    contactname: z.string()
        .min(1, { message: "Tên người liên hệ không hợp lệ" })
        .max(512, { message: "Tên người liên hệ không hợp lệ" }),
    email: z.string()
        .min(1, { message: "Địa chỉ Email không hợp lệ" })
        .regex(/^[a-zA-Z0-9]/, { message: "Địa chỉ Email không hợp lệ" }),
    address: z.string()
        .min(1, { message: "Địa chỉ không hợp lệ" })
        .max(512, { message: "Địa chỉ không hợp lệ" }),
});

export const zoneSchema = z.object({
    zonename: z.string()
        .min(1, { message: "Tên khu vực không hợp lệ" })
        .max(512, { message: "Tên khu vực không hợp lệ" }),
    zonedescription: z.string()
        .max(512, { message: "Mô tả không hợp lệ" }),
});

export const courtSchema = z.object({
    courtname: z.string()
        .min(1, { message: "Tên sân không hợp lệ" })
        .max(512, { message: "Tên sân không hợp lệ" }),
});

export const ratingSchema = z
    .number()
    .min(0, { message: "Điểm số phải từ 0 tới 5" })
    .max(5, { message: "Điểm số phải từ 0 tới 5" })
    .refine((val) => val >= 0, {
        message: "Điểm số phải từ 0 tới 5",
    });