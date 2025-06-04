import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EmployeeAddForm = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-10 w-full">
                <div className="flex flex-col gap-1 w-full">
                    <Label
                        htmlFor="employeeFullname"
                        className="text-xs font-semibold"
                    >
                        Họ tên nhân viên
                    </Label>
                    <Input
                        id="employeeFullname"
                        name="employeeFullname"
                        type="text"
                        placeholder="Nhập họ tên nhân viên"
                        className="w-full"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <Label
                        htmlFor="employeDob"
                        className="text-xs font-semibold"
                    >
                        Ngày sinh
                    </Label>
                    <Input
                        id="employeDob"
                        name="employeDob"
                        type="date"
                        className="w-full"
                        required
                    />
                </div>
            </div>
            <div className="flex gap-10 w-full">
                <div className="flex flex-col gap-1 w-full">
                    <Label
                        htmlFor="employeeUsername"
                        className="text-xs font-semibold"
                    >
                        Tên đăng nhập (Hệ thống tạo tự động nếu để trống)
                    </Label>
                    <Input
                        id="employeeUsername"
                        name="employeeUsername"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full h-full justify-between">
                    <span className="text-xs font-semibold">
                        Vai trò
                    </span>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="role-employee">Quản lý sân</SelectItem>
                            <SelectItem value="role-wh_manager">Quản lý kho hàng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="employeePassword"
                    className="text-xs font-semibold"
                >
                    Mật khẩu (Mặc đinh là ngày sinh của nhân viên DDMMYYYY nếu để trống)
                </Label>
                <Input
                    id="employeePassword"
                    name="employeePassword"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full"
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="employeeEmail"
                    className="text-xs font-semibold"
                >
                    Email nhân viên để gửi thông tin tài khoản
                </Label>
                <Input
                    id="employeeEmail"
                    name="employeeEmail"
                    type="email"
                    placeholder="Nhập email"
                    className="w-full"
                    required
                />
            </div>
        </div>
    );
}

export default EmployeeAddForm;