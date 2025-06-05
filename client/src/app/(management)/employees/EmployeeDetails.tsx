import MaskedField from '@/components/atomic/MaskedField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateString, formatPrice } from '@/lib/utils';
import { putBankActive, putEmployee } from '@/services/employees.service';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import BankDetailAddForm from './BankDetailAddForm';
import { EmployeesProps } from './EmployeeList';

interface EmployeeDetailsProps {
    employee: EmployeesProps;
    onSuccess: () => void;
}

interface FormData {
    fullname: string;
    gender: string;
    dob: Date;
    email: string;
    phonenumber: string;
    address: string;
    avatar: File | null;
    employee_type: string;
    salary: number;
    cccd: string;
    expiry_cccd: Date;
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
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fullname: employee.fullname || '',
        gender: employee.gender || '',
        dob: employee.dob || new Date(),
        email: employee.email || '',
        phonenumber: employee.phonenumber || '',
        address: employee.address || '',
        employee_type: employee.employee_type || '',
        salary: employee.salary || 0,
        cccd: employee.cccd || '',
        expiry_cccd: employee.expiry_cccd || new Date(),
        taxcode: employee.taxcode || '',
        role: employee.role || '',
        avatar: null,
    });

    const handleBankDetailSuccess = () => {
        toast.success('Thêm thông tin ngân hàng thành công');
        setIsEditing(false);
        setIsAddDialogOpen(false);
        onSuccess();
    };

    const handleBankActive = async (bankdetailid: number) => {
        const result = await putBankActive(employee.employeeid || 0, { bankdetailid: bankdetailid, active: true });
        if (result.ok) {
            toast.success('Cập nhật thông tin ngân hàng thành công');
        } else {
            toast.error(result.message || 'Cập nhật thông tin ngân hàng thất bại');
        }
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const handleEmployeeTypeChange = (value: string) => {
        setFormData({ ...formData, employee_type: value });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, avatar: file }));
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setFormData({
            fullname: employee.fullname || '',
            gender: employee.gender || '',
            dob: employee.dob || new Date(employee.dob || ''),
            email: employee.email || '',
            phonenumber: employee.phonenumber || '',
            address: employee.address || '',
            employee_type: employee.employee_type || '',
            salary: employee.salary || 0,
            cccd: employee.cccd || '',
            expiry_cccd: employee.expiry_cccd || new Date(employee.expiry_cccd || ''),
            taxcode: employee.taxcode || '',
            role: employee.role || '',
            avatar: null,
        });
        // Clean up avatar and preview
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setFormData((prev) => ({
            ...prev,
            avatar: null,
        }));
        setAvatarPreview(null);
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
                expiry_cccd: formatDateString(formData.expiry_cccd),
                taxcode: formData.taxcode,
                role: formData.role,
                avatar: formData.avatar || undefined,
            });

            if (result.ok) {
                toast.success('Cập nhật thông tin nhân viên thành công');
                setIsEditing(false);
                if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                }
                setFormData((prev) => ({
                    ...prev,
                    avatar: null,
                }));
                setAvatarPreview(null);
                Object.assign(employee, { ...formData, avatarurl: result.data.avatarurl });
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
                        src={avatarPreview || employee.avatarurl || `/logo.png`}
                        alt={`Hình của nhân viên ${formData.fullname}`}
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
                                name="fullname"
                                type="text"
                                value={formData.fullname}
                                onChange={handleInputChange}
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
                                name="dob"
                                type="date"
                                value={formatDateString(formData.dob)}
                                onChange={handleInputChange}
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
                                name="gender"
                                type="text"
                                value={formData.gender}
                                onChange={handleInputChange}
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
                                name="phonenumber"
                                type="text"
                                value={formData.phonenumber}
                                onChange={handleInputChange}
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
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
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
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
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
                                name="cccd"
                                type="text"
                                value={formData.cccd}
                                onChange={handleInputChange}
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
                                name="expiry_cccd"
                                type="date"
                                value={formatDateString(formData.expiry_cccd)}
                                onChange={handleInputChange}
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
                                name="taxcode"
                                type="text"
                                value={formData.taxcode}
                                onChange={handleInputChange}
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
                                <BankDetailAddForm
                                    onSuccess={handleBankDetailSuccess}
                                    employeeId={employee.employeeid}
                                />
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
                                            <Icon
                                                icon={bank.active ? 'nrk:check-active' : 'nrk:check-active'}
                                                className={`text-primary size-5 ${!isEditing ? (!bank.active ? 'opacity-0' : '') : !bank.active ? 'cursor-pointer opacity-30 hover:opacity-100' : 'opacity-100'} `}
                                                onClick={() => {
                                                    if (!isEditing || bank.active) return;
                                                    handleBankActive(bank.bankdetailid);
                                                }}
                                            />
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

                            <Select disabled={!isEditing} value={formData.role} onValueChange={handleRoleChange}>
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
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-type" className="text-xs font-semibold">
                                Loại nhân viên
                            </Label>
                            <Select
                                disabled={!isEditing}
                                value={formData.employee_type}
                                onValueChange={handleEmployeeTypeChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="full-time">Toàn thời gian</SelectItem>
                                    <SelectItem value="part-time">Bán thời gian</SelectItem>
                                </SelectContent>
                            </Select>
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
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleInputChange}
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
