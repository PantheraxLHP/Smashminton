import MaskedField from '@/components/atomic/MaskedField';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatDateString } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { EmployeesProps } from './EmployeeList';
import BankDetailAddForm from './BankDetailAddForm';
import { putEmployee } from '@/services/employees.service';
import { toast } from 'sonner';

interface EmployeeDetailsProps {
    employee: EmployeesProps;
    onSuccess: () => void;
}

interface FormData {
    fullname: string;
    gender: string;
    dob: string;
    email: string;
    phonenumber: string;
    address: string;
    employee_type: string;
    salary: number;
    cccd: string;
    expiry_cccd: string;
    taxcode: string;
    role: string;
}

const EmployeeDetails = ({ employee, onSuccess }: EmployeeDetailsProps) => {
    const [randomGender, setRandomGender] = useState<number>(Math.floor(Math.random() * 2 + 1));
    const tabs = ['Thông tin cơ bản', 'Thông tin ngân hàng', 'Thông tin lương, thưởng, phạt'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const editAvatarRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);

    // Helper function to safely convert date to string
    const dateToString = (date: string | Date | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') return date;
        return date.toISOString().split('T')[0]; // Convert Date to YYYY-MM-DD format
    };

    const [formData, setFormData] = useState<FormData>({
        fullname: employee.fullname || '',
        gender: employee.gender || '',
        dob: dateToString(employee.dob),
        email: employee.email || '',
        phonenumber: employee.phonenumber || '',
        address: employee.address || '',
        employee_type: employee.employee_type || '',
        salary: employee.salary || 0,
        cccd: employee.cccd || '',
        expiry_cccd: dateToString(employee.expiry_cccd),
        taxcode: employee.taxcode || '',
        role: employee.role || '',
    });

    // Reset form data when employee prop changes or when canceling edit
    useEffect(() => {
        setFormData({
            fullname: employee.fullname || '',
            gender: employee.gender || '',
            dob: dateToString(employee.dob),
            email: employee.email || '',
            phonenumber: employee.phonenumber || '',
            address: employee.address || '',
            employee_type: employee.employee_type || '',
            salary: employee.salary || 0,
            cccd: employee.cccd || '',
            expiry_cccd: dateToString(employee.expiry_cccd),
            taxcode: employee.taxcode || '',
            role: employee.role || '',
        });
    }, [employee]);

    const handleInputChange = (field: keyof FormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatar(file);
        }
    };

    const handleCancel = () => {
        // Reset form data to original employee data
        setFormData({
            fullname: employee.fullname || '',
            gender: employee.gender || '',
            dob: dateToString(employee.dob),
            email: employee.email || '',
            phonenumber: employee.phonenumber || '',
            address: employee.address || '',
            employee_type: employee.employee_type || '',
            salary: employee.salary || 0,
            cccd: employee.cccd || '',
            expiry_cccd: dateToString(employee.expiry_cccd),
            taxcode: employee.taxcode || '',
            role: employee.role || '',
        });
        setAvatar(null);
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await putEmployee(employee.employeeid, {
                fullname: formData.fullname,
                gender: formData.gender,
                dob: formatDateString(formData.dob),
                email: formData.email,
                phone: formData.phonenumber,
                address: formData.address,
                position: formData.employee_type,
                salary: formData.salary,
                cccd: formData.cccd,
                expiry_cccd: formData.expiry_cccd,
                taxcode: formData.taxcode,
                role: formData.role,
                avatar: avatar || undefined,
            });

            console.log(result);
            if (result.ok) {
                toast.success('Cập nhật thông tin nhân viên thành công');
                setIsEditing(false);
                setAvatar(null);
                // Update the original employee data with new values
                Object.assign(employee, formData);
                onSuccess();
            } else {
                toast.error(result.message || 'Cập nhật thông tin nhân viên thất bại');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error('Có lỗi xảy ra khi cập nhật thông tin nhân viên');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-full flex-col gap-5">
            {/* Header (Hình đại diện + thông tin chung) */}
            <div className="flex w-full items-center gap-5">
                <div className="border-primary relative aspect-square h-full w-40 rounded-lg border-2 bg-green-50">
                    <Image
                        src={`/logo.png`}
                        alt={`Hình của nhân viên A`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                    />
                    <div
                        className={`border-primary hover:bg-primary-100 absolute right-0 bottom-0 flex h-7 w-7 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white ${isEditing ? 'cursor-pointer opacity-100' : 'opacity-0'}`}
                        onClick={() => {
                            if (editAvatarRef.current) {
                                editAvatarRef.current.click();
                            }
                        }}
                    >
                        <Icon icon="material-symbols:edit-outline" className={`text-primary size-5`} />
                        <input
                            disabled={!isEditing}
                            ref={editAvatarRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:user-round-pen" className="text-primary size-5" />
                        {formData.fullname}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon
                            icon={`${randomGender % 2 === 0 ? 'tdesign:gender-male' : 'tdesign:gender-female'}`}
                            className="text-primary size-5"
                        />
                        {formData.gender}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:work-outline" className="text-primary size-5" />
                        {formData.employee_type}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:phone" className="text-primary size-5" />
                        {formData.phonenumber}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:mail" className="text-primary size-5" />
                        {formData.email}
                    </div>
                </div>
                <div className="flex h-full flex-col justify-end">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button variant="outline" disabled={isSaving} onClick={handleSave}>
                                {isSaving ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
            </div>
            {/* Tab Header */}
            <div className="relative flex w-full items-center">
                <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-gray-500"></div>
                {tabs.map((tab, index) => (
                    <div
                        key={`tab-${index}`}
                        className={`border-content relative flex h-full w-65 cursor-pointer items-center justify-center border-b-3 p-4 ${selectedTab === tab ? 'border-primary text-primary bg-white' : 'border-transparent'}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            {/* Tab Content */}
            {selectedTab === 'Thông tin cơ bản' && (
                <div className="flex h-full w-full flex-col gap-10">
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-id" className="text-xs font-semibold">
                                Mã nhân viên
                            </Label>
                            <Input
                                disabled={true}
                                id="employee-id"
                                type="text"
                                value={employee.employeeid || ''}
                                readOnly
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-name" className="text-xs font-semibold">
                                Họ tên nhân viên
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-name"
                                type="text"
                                value={formData.fullname}
                                onChange={(e) => handleInputChange('fullname', e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-dob" className="text-xs font-semibold">
                                Ngày sinh
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-dob"
                                type="date"
                                value={formatDateString(formData.dob)}
                                onChange={(e) => handleInputChange('dob', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-gender" className="text-xs font-semibold">
                                Giới tính
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-gender"
                                type="text"
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-phonenumber" className="text-xs font-semibold">
                                Số điện thoại
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-phonenumber"
                                type="text"
                                value={formData.phonenumber}
                                onChange={(e) => handleInputChange('phonenumber', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-email" className="text-xs font-semibold">
                                Email
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-address" className="text-xs font-semibold">
                                Địa chỉ
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-address"
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-startday" className="text-xs font-semibold">
                                Ngày bắt đầu làm việc
                            </Label>
                            <Input
                                disabled={true}
                                id="employee-startday"
                                type="date"
                                value={formatDateString(employee.createdat || '')}
                                readOnly
                                className=""
                            />
                        </div>
                    </div>
                </div>
            )}
            {selectedTab === 'Thông tin ngân hàng' && (
                <div className="flex h-full w-full flex-col gap-5">
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-cccd" className="text-xs font-semibold">
                                Số CCCD
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-cccd"
                                type="text"
                                value={formData.cccd}
                                onChange={(e) => handleInputChange('cccd', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-cccdexpireddate" className="text-xs font-semibold">
                                Ngày hết hạn CCCD
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-cccdexpireddate"
                                type="date"
                                value={formData.expiry_cccd}
                                onChange={(e) => handleInputChange('expiry_cccd', e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-taxcode" className="text-xs font-semibold">
                                Mã số thuế
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-taxcode"
                                type="text"
                                value={formData.taxcode}
                                onChange={(e) => handleInputChange('taxcode', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="w-full"></div>
                    </div>
                    <div className="flex h-full w-full flex-col gap-2">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <div className="flex w-full justify-end">
                                <Button
                                    variant="outline"
                                    className=""
                                    disabled={!isEditing}
                                    onClick={() => setIsAddDialogOpen(true)}
                                >
                                    Thêm ngân hàng
                                </Button>
                            </div>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Thêm thông tin ngân hàng</DialogTitle>
                                    <DialogDescription>
                                        Vui lòng điền đầy đủ thông tin ngân hàng của nhân viên.
                                    </DialogDescription>
                                </DialogHeader>
                                <BankDetailAddForm />
                                <DialogFooter>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary">Hủy</Button>
                                    </DialogTrigger>
                                    <Button variant="outline">Lưu</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="flex h-full w-full flex-col">
                            <div className="flex w-full items-center">
                                <span className="w-full border-b-2 border-gray-400 p-2 text-xs font-semibold">
                                    Số tài khoản ngân hàng
                                </span>
                                <span className="w-full border-b-2 border-gray-400 p-2 text-xs font-semibold">
                                    Tên chủ tài khoản
                                </span>
                                <span className="w-full border-b-2 border-gray-400 p-2 text-xs font-semibold">
                                    Tên ngân hàng
                                </span>
                                <span className="flex w-full justify-center border-b-2 border-gray-400 p-2 text-center text-xs font-semibold">
                                    Được sử dụng
                                </span>
                            </div>
                            <div className="flex h-full max-h-full w-full flex-col overflow-y-auto">
                                {employee.bank_detail?.map((bank) => (
                                    <div key={bank.bankdetailid} className="flex w-full items-center">
                                        <div className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                            <MaskedField value={`${bank.banknumber}`} />
                                        </div>
                                        <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                            {bank.bankholder}
                                        </span>
                                        <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                            {bank.bankname}
                                        </span>
                                        <span className="flex h-full w-full items-center justify-center border-b-2 border-gray-200 p-2 text-center">
                                            <Icon icon="nrk:check-active" className="text-primary size-5" />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {selectedTab === 'Thông tin lương, thưởng, phạt' && (
                <div className="flex h-full w-full flex-col gap-5">
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-role" className="text-xs font-semibold">
                                Vai trò
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-role"
                                type="text"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-type" className="text-xs font-semibold">
                                Loại nhân viên
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-type"
                                type="text"
                                value={formData.employee_type}
                                onChange={(e) => handleInputChange('employee_type', e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-salary" className="text-xs font-semibold">
                                Lương cơ bản
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-salary"
                                type="number"
                                value={formData.salary}
                                onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                                className=""
                            />
                        </div>
                        <div className="w-full"></div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-monthrewardamount" className="text-xs font-semibold">
                                Tổng tiền thưởng cho{' '}
                                {new Date().toLocaleDateString('vi-VN', {
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </Label>
                            <Input
                                disabled={true}
                                id="employee-monthrewardamount"
                                type="text"
                                value={`+ ${formatPrice(
                                    employee.reward_records?.reduce(
                                        (acc, curr) => acc + Number(curr.finalrewardamount || 0),
                                        0,
                                    ) || 0,
                                )}`}
                                onChange={() => {}}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-monthpenaltyamount" className="text-xs font-semibold">
                                Tổng tiền phạt cho{' '}
                                {new Date().toLocaleDateString('vi-VN', {
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </Label>
                            <Input
                                disabled={true}
                                id="employee-monthpenaltyamount"
                                type="text"
                                value={`- ${formatPrice(
                                    employee.penalty_records?.reduce(
                                        (acc, curr) => acc + Number(curr.finalpenaltyamount || 0),
                                        0,
                                    ) || 0,
                                )}`}
                                onChange={() => {}}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex h-full w-full justify-between gap-10">
                        <div className="flex w-full flex-col gap-1">
                            <span className="text-xs font-semibold">Thưởng của tháng {new Date().getMonth() + 1}</span>
                            <div className="flex h-full w-full flex-col gap-2 rounded-lg border-2 border-gray-400 p-2">
                                {employee.reward_records?.map((reward) => {
                                    return (
                                        <div key={reward.rewardrecordid} className="flex w-full items-center">
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                                {formatDateString(reward.rewarddate || '')}
                                            </span>
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                                {reward.reward_rules?.rewardname || ''}
                                            </span>
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                                + {formatPrice(reward.finalrewardamount || 0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <span className="text-xs font-semibold">
                                Lỗi phạt của tháng {new Date().getMonth() + 1}
                            </span>
                            <div className="flex h-full w-full flex-col gap-2 rounded-lg border-2 border-gray-400 p-2">
                                {employee.penalty_records?.map((penalty) => {
                                    return (
                                        <div key={penalty.penaltyrecordid} className="flex w-full items-center">
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                                {formatDateString(penalty.violationdate || '')}
                                            </span>
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                                {penalty.penalty_rules?.penaltyname || ''}
                                            </span>
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2">
                                                - {formatPrice(penalty.finalpenaltyamount || 0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetails;
