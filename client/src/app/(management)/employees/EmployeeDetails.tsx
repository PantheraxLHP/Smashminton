import MaskedField from '@/components/atomic/MaskedField';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatDateString } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { EmployeesProps } from './EmployeeList';

interface EmployeeDetailsProps {
    employee: EmployeesProps;
}

const EmployeeDetails = ({ employee }: EmployeeDetailsProps) => {
    const [randomGender, setRandomGender] = useState<number>(Math.floor(Math.random() * 2 + 1));
    const tabs = ['Thông tin cơ bản', 'Thông tin ngân hàng', 'Thông tin lương, thưởng, phạt'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const editAvatarRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Selected file:', file);
        }
    }

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
                        className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border-2 border-primary bg-white hover:bg-primary-100"
                    >
                        <Icon
                            icon="material-symbols:edit-outline"
                            className="text-primary size-5"
                            onClick={() => {
                                if (editAvatarRef.current) {
                                    editAvatarRef.current.click();
                                }
                            }}
                        />
                        <input
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
                        {employee.fullname || ''}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon
                            icon={`${randomGender % 2 === 0 ? 'tdesign:gender-male' : 'tdesign:gender-female'}`}
                            className="text-primary size-5"
                        />
                        {employee.gender || ''}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:work-outline" className="text-primary size-5" />
                        {employee.employee_type}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:phone" className="text-primary size-5" />
                        {employee.phonenumber || ''}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:mail" className="text-primary size-5" />
                        {employee.email || ''}
                    </div>
                </div>
                <div className="flex h-full flex-col justify-end">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                Hủy
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Lưu
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
                                disabled={!isEditing}
                                id="employee-id"
                                type="text"
                                value={employee.employeeid || ''}
                                onChange={() => {}}
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
                                value={employee.fullname || ''}
                                onChange={() => {}}
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
                                value={formatDateString(employee.dob || '')}
                                onChange={() => {}}
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
                                value={employee.gender || ''}
                                onChange={() => {}}
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
                                value={employee.phonenumber || ''}
                                onChange={() => {}}
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
                                value={employee.email || ''}
                                onChange={() => {}}
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
                                value={employee.address || ''}
                                onChange={() => {}}
                                className=""
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="employee-startday" className="text-xs font-semibold">
                                Ngày bắt đầu làm việc
                            </Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-startday"
                                type="date"
                                value={formatDateString(employee.createdat || '')}
                                onChange={() => {}}
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
                                value={employee.cccd || ''}
                                onChange={() => {}}
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
                                value={`${employee.expiry_cccd}`}
                                onChange={() => {}}
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
                                value={employee.taxcode || ''}
                                onChange={() => {}}
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
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="bank-name" className="text-xs font-semibold">
                                        Tên ngân hàng
                                    </Label>
                                    <Input id="bank-name" type="text" placeholder="Ngân hàng ABC" className="" />
                                    <Label htmlFor="bank-account-number" className="text-xs font-semibold">
                                        Số tài khoản
                                    </Label>
                                    <Input id="bank-account-number" type="text" placeholder="1234567890" className="" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Lưu</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="flex h-full w-full flex-col">
                            <div className="flex w-full items-center">
                                <span className="w-full border-b-2 border-gray-400 p-2 text-xs font-semibold">
                                    Số tài khoản ngân hàng
                                </span>
                                <span className="w-full border-b-2 border-gray-400 p-2 text-xs font-semibold">
                                    Tên chủ tài khoảng
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
                                value={employee.role || ''}
                                onChange={() => {}}
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
                                value={employee.employee_type || ''}
                                onChange={() => {}}
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
                                type="text"
                                value={formatPrice(employee.salary || 0)}
                                onChange={() => {}}
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
