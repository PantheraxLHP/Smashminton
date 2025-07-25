import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { postEmployee } from '@/services/employees.service';
import { toast } from 'sonner';
import { useState } from 'react';

interface EmployeeAddFormProps {
    onSuccess: () => void;
}

const EmployeeAddForm = ({ onSuccess }: EmployeeAddFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        fullname: '',
        dob: '',
        username: '',
        password: '',
        email: '',
        role: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleRoleChange = (value: string) => {
        setEmployeeData({ ...employeeData, role: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeData.role) {
            toast.warning('Vui lòng chọn vai trò cho nhân viên');
            return;
        }
        setIsSubmitting(true);
        const result = await postEmployee(employeeData);
        if (result.ok) {
            toast.success('Thêm nhân viên thành công');
            onSuccess();
        } else {
            toast.error(result.message || 'Thêm nhân viên thất bại');
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex w-full gap-10">
                <div className="flex w-full flex-col gap-1">
                    <Label htmlFor="employeeFullname" className="text-xs font-semibold">
                        Họ tên nhân viên
                    </Label>
                    <Input
                        id="employeeFullname"
                        name="fullname"
                        type="text"
                        value={employeeData.fullname}
                        onChange={handleChange}
                        placeholder="Nhập họ tên nhân viên"
                        className="w-full"
                        required
                    />
                </div>
                <div className="flex w-full flex-col gap-1">
                    <Label htmlFor="employeeDob" className="text-xs font-semibold">
                        Ngày sinh
                    </Label>
                    <Input
                        id="employeeDob"
                        name="dob"
                        type="date"
                        value={employeeData.dob}
                        onChange={handleChange}
                        className="w-full"
                        min={
                            new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                                .toISOString()
                                .split('T')[0]
                        }
                        max={
                            new Date(new Date().setFullYear(new Date().getFullYear() - 16))
                                .toISOString()
                                .split('T')[0]
                        }
                        required
                    />
                </div>
            </div>
            <div className="flex w-full gap-10">
                <div className="flex w-full flex-col gap-1">
                    <Label htmlFor="employeeUsername" className="text-xs font-semibold">
                        Tên đăng nhập (Hệ thống tạo tự động nếu để trống)
                    </Label>
                    <Input
                        id="employeeUsername"
                        name="username"
                        type="text"
                        value={employeeData.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                        className="w-full"
                    />
                </div>
                <div className="flex h-full w-full flex-col justify-between gap-1">
                    <span className="text-xs font-semibold">Vai trò</span>
                    <Select value={employeeData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="employee">Quản lý sân</SelectItem>
                            <SelectItem value="wh_manager">Quản lý kho hàng</SelectItem>
                            <SelectItem value="hr_manager">Quản lý nhân sự</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="employeePassword" className="text-xs font-semibold">
                    Mật khẩu (Mặc đinh là ngày sinh của nhân viên DDMMYYYY nếu để trống)
                </Label>
                <Input
                    id="employeePassword"
                    name="password"
                    type="password"
                    value={employeeData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full"
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="employeeEmail" className="text-xs font-semibold">
                    Email nhân viên để gửi thông tin tài khoản
                </Label>
                <Input
                    id="employeeEmail"
                    name="email"
                    type="email"
                    value={employeeData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className="w-full"
                    required
                />
            </div>
            <div className="flex w-full justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => onSuccess()}>
                    Thoát
                </Button>
                <Button variant="outline" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Thêm'}
                </Button>
            </div>
        </form>
    );
};

export default EmployeeAddForm;
