import MaskedField from '@/components/atomic/MaskedField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateString, formatEmployeeType, formatPrice } from '@/lib/utils';
import { putBankActive, putEmployee } from '@/services/employees.service';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import BankDetailAddForm from './BankDetailAddForm';
import { EmployeesProps } from './EmployeeList';

interface EmployeeDetailsProps {
    employee: EmployeesProps;
    onSuccess: () => void;
}

interface FormData {
    employeeid: number;
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
    const [randomGender] = useState<number>(Math.floor(Math.random() * 2 + 1));
    const tabs = ['Thông tin cơ bản', 'Thông tin ngân hàng', 'Thông tin lương, thưởng, phạt'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const editAvatarRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bankDetails, setBankDetails] = useState(employee.bank_detail || []);
    const [formData, setFormData] = useState<FormData>({
        employeeid: employee.employeeid || 0,
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

    // Sync bankDetails with employee.bank_detail when employee prop changes
    useEffect(() => {
        setBankDetails(employee.bank_detail || []);
    }, [employee.bank_detail]);

    // Reusable field renderer
    const renderField = (id: string, label: string, name: keyof FormData, type = 'text', disabled = false) => (
        <div className="flex w-full flex-col gap-1">
            <Label htmlFor={id} className="text-xs font-semibold">
                {label}
            </Label>
            <Input
                disabled={disabled || !isEditing}
                id={id}
                name={name}
                type={type}
                value={type === 'date' ? formatDateString(formData[name] as any) : (formData[name] as string)}
                onChange={handleInputChange}
                className=""
            />
        </div>
    );

    // Reusable field pair renderer
    const renderFieldPair = (field1: any, field2: any) => (
        <div className="flex w-full items-center justify-between gap-10">
            {field1}
            {field2}
        </div>
    );

    const handleBankDetailSuccess = () => {
        toast.success('Thêm thông tin ngân hàng thành công');
        // Remove local state update - let refetch handle data updates
        setIsAddDialogOpen(false);

        // Refetch data to get updated information
        onSuccess();
    };

    const handleBankActive = async (bankdetailid: number) => {
        const result = await putBankActive(employee.employeeid || 0, { bankdetailid: bankdetailid, active: true });
        if (result.ok) {
            setBankDetails((prev) =>
                prev.map((bank) => ({
                    ...bank,
                    active: bank.bankdetailid === bankdetailid,
                })),
            );
            toast.success('Cập nhật thông tin ngân hàng thành công');
        } else {
            toast.error(result.message || 'Cập nhật thông tin ngân hàng thất bại');
        }
    };

    const handleRoleChange = (role: string) => {
        const employeeTypeMap: Record<string, string> = {
            employee: 'Part-time',
            wh_manager: 'Full-time',
            hr_manager: 'Full-time',
        };
        setFormData({ ...formData, role, employee_type: employeeTypeMap[role] || '' });
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

    const resetForm = () => {
        setFormData({
            employeeid: employee.employeeid || 0,
            fullname: employee.fullname || '',
            gender: employee.gender || '',
            dob: employee.dob || new Date(employee.dob || ''),
            email: employee.email || '',
            phonenumber: employee.phonenumber || '',
            address: employee.address || '',
            salary: employee.salary || 0,
            cccd: employee.cccd || '',
            expiry_cccd: employee.expiry_cccd || new Date(employee.expiry_cccd || ''),
            taxcode: employee.taxcode || '',
            role: employee.role || '',
            employee_type: employee.employee_type || '',
            avatar: null,
        });
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
    };

    const handleCancel = () => {
        resetForm();
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Prepare data with date formatting
            const saveData = {
                ...formData,
                dob: formatDateString(formData.dob),
                expiry_cccd: formatDateString(formData.expiry_cccd),
                avatar: formData.avatar || undefined,
            };

            const result = await putEmployee(employee.employeeid, saveData);

            if (result.ok) {
                toast.success('Cập nhật thông tin nhân viên thành công');
                // Don't exit edit mode - remove setIsEditing(false)
                // Don't reset form - keep current form data

                // Update the employee object with new data including avatar URL
                Object.assign(employee, {
                    ...formData,
                    avatarurl: result.data.avatarurl,
                    dob: formData.dob,
                    expiry_cccd: formData.expiry_cccd,
                });

                // Clear avatar file from form since it's now saved
                setFormData((prev) => ({ ...prev, avatar: null }));

                // Clear avatar preview
                if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview(null);
                }

                // Refetch data to get updated information
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
            {/* Header */}
            <div className="flex w-full items-center gap-5">
                <div className="border-primary relative aspect-square h-full w-40 rounded-lg border-2 bg-green-50">
                    <Image
                        src={avatarPreview || employee.avatarurl || `/user.png`}
                        alt={`Hình của nhân viên ${formData.fullname}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                    />
                    <div
                        className={`border-primary hover:bg-primary-100 absolute right-0 bottom-0 flex h-7 w-7 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white ${isEditing ? 'cursor-pointer opacity-100' : 'opacity-0'}`}
                        onClick={() => editAvatarRef.current?.click()}
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
                    {[
                        { icon: 'lucide:user-round-pen', value: formData.fullname },
                        {
                            icon: randomGender % 2 === 0 ? 'tdesign:gender-male' : 'tdesign:gender-female',
                            value: formData.gender,
                        },
                        { icon: 'material-symbols:work-outline', value: formData.employee_type },
                        { icon: 'mdi:phone', value: formData.phonenumber },
                        { icon: 'material-symbols:mail', value: formData.email },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Icon icon={item.icon} className="text-primary size-5" />
                            {item.value}
                        </div>
                    ))}
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
                    {renderFieldPair(
                        renderField('employee-id', 'Mã nhân viên', 'employeeid', 'text', true),
                        renderField('employee-name', 'Họ tên nhân viên', 'fullname'),
                    )}
                    {renderFieldPair(
                        renderField('employee-dob', 'Ngày sinh', 'dob', 'date'),
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-gender" className="text-xs font-semibold">
                                Giới tính
                            </Label>
                            <Select
                                disabled={!isEditing}
                                value={formData.gender}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                            >
                                <SelectTrigger id="employee-gender" className="">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nam">Nam</SelectItem>
                                    <SelectItem value="Nữ">Nữ</SelectItem>
                                    <SelectItem value="Khác">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>,
                    )}
                    {renderFieldPair(
                        renderField('employee-phonenumber', 'Số điện thoại', 'phonenumber'),
                        renderField('employee-email', 'Email', 'email', 'email'),
                    )}
                    {renderFieldPair(
                        renderField('employee-address', 'Địa chỉ', 'address'),
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
                        </div>,
                    )}
                </div>
            )}

            {selectedTab === 'Thông tin ngân hàng' && (
                <div className="flex h-full w-full flex-col gap-5">
                    {renderFieldPair(
                        renderField('employee-cccd', 'Số CCCD', 'cccd'),
                        renderField('employee-cccdexpireddate', 'Ngày hết hạn CCCD', 'expiry_cccd', 'date'),
                    )}
                    {renderFieldPair(
                        renderField('employee-taxcode', 'Mã số thuế', 'taxcode'),
                        <div className="w-full"></div>,
                    )}

                    <div className="flex h-full w-full flex-col gap-2">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <div className="flex w-full justify-end">
                                <Button
                                    variant="outline"
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
                                {['Số tài khoản ngân hàng', 'Tên chủ tài khoản', 'Tên ngân hàng', 'Được sử dụng'].map(
                                    (header, index) => (
                                        <span
                                            key={index}
                                            className={`w-full border-b-2 border-gray-400 p-2 text-xs font-semibold ${index === 3 ? 'flex justify-center text-center' : ''}`}
                                        >
                                            {header}
                                        </span>
                                    ),
                                )}
                            </div>
                            <div className="flex h-full max-h-full w-full flex-col overflow-y-auto">
                                {bankDetails?.map((bank) => (
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
                                                icon="nrk:check-active"
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
                            <Input
                                disabled={true}
                                id="employee-type"
                                name="employee_type"
                                type="text"
                                value={formatEmployeeType(formData.employee_type)}
                            />
                        </div>
                    </div>
                    {renderFieldPair(
                        renderField('employee-salary', 'Lương cơ bản', 'salary', 'number'),
                        <div className="w-full"></div>,
                    )}

                    {/* Month summary fields */}
                    <div className="flex w-full items-center justify-between gap-10">
                        {[
                            {
                                id: 'employee-monthrewardamount',
                                label: `Tổng tiền thưởng cho ${new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}`,
                                value: `+ ${formatPrice(employee.reward_records?.reduce((acc, curr) => acc + Number(curr.finalrewardamount || 0), 0) || 0)}`,
                            },
                            {
                                id: 'employee-monthpenaltyamount',
                                label: `Tổng tiền phạt cho ${new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}`,
                                value: `- ${formatPrice(employee.penalty_records?.reduce((acc, curr) => acc + Number(curr.finalpenaltyamount || 0), 0) || 0)}`,
                            },
                        ].map((field) => (
                            <div key={field.id} className="flex w-full flex-col gap-1">
                                <Label htmlFor={field.id} className="text-xs font-semibold">
                                    {field.label}
                                </Label>
                                <Input disabled={true} id={field.id} type="text" value={field.value} readOnly />
                            </div>
                        ))}
                    </div>

                    {/* Records display */}
                    <div className="flex h-full w-full justify-between gap-10">
                        {[
                            {
                                title: `Thưởng của tháng ${new Date().getMonth() + 1}`,
                                records: employee.reward_records,
                                type: 'reward',
                            },
                            {
                                title: `Lỗi phạt của tháng ${new Date().getMonth() + 1}`,
                                records: employee.penalty_records,
                                type: 'penalty',
                            },
                        ].map((section) => (
                            <div key={section.type} className="flex w-full flex-col gap-1">
                                <span className="text-xs font-semibold">{section.title}</span>
                                <div className="flex h-full w-full flex-col gap-2 rounded-lg border-2 border-gray-400 p-2">
                                    {section.records?.map((record: any) => (
                                        <div
                                            key={record[`${section.type}recordid`]}
                                            className="flex w-full items-center"
                                        >
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2 text-sm">
                                                {formatDateString(
                                                    section.type === 'reward'
                                                        ? record.rewardapplieddate
                                                        : record.violationdate || '',
                                                )}
                                            </span>
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2 text-sm">
                                                {section.type === 'reward'
                                                    ? record.reward_rules?.rewardname
                                                    : record.penalty_rules?.penaltyname || ''}
                                            </span>
                                            <span className="flex h-full w-full items-center border-b-2 border-gray-200 p-2 text-sm">
                                                {section.type === 'reward' ? '+' : '-'}{' '}
                                                {formatPrice(
                                                    section.type === 'reward'
                                                        ? record.finalrewardamount
                                                        : record.finalpenaltyamount || 0,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetails;
