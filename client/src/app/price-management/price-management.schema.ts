import { z } from "zod";

export const serviceSchema = z.object({
    productname: z.string().min(1, { message: "Tên dịch vụ không được để trống" }),
    price: z
        .number()
        .min(1, { message: "Giá không được để trống" })
        .max(1000000000, { message: "Giá vượt quá giới hạn" })
        .refine((val) => val > 0, {
            message: "Giá không hợp lệ. Vui lòng nhập giá lớn hơn 0.",
        }),
    servicetype: z.string().min(1, { message: "Chọn dịch vụ" }),
    shoeSize: z.string().optional(),
    racketWeight: z.string().optional(),
});


export const priceSchema = z
    .number()
    .min(0, "Giá không hợp lệ")
    .max(1000000000, "Giá vượt quá giới hạn")
    .refine((val) => val > 0, {
        message: "Giá không hợp lệ. Vui lòng nhập giá lớn hơn 0.",
});
