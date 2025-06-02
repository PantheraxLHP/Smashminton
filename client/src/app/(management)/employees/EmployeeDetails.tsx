import { Icon } from '@iconify/react';
import { useState } from 'react';
import Image from 'next/image';
import MaskedField from '@/components/atomic/MaskedField';
import { formatPrice } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';

const EmployeeDetails = () => {
    const [randomGender, setRandomGender] = useState<number>(Math.floor(Math.random() * 2 + 1));
    const tabs = ["Thông tin cơ bản", "Thông tin ngân hàng", "Thông tin lương, thưởng, phạt"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <div className="flex flex-col gap-5 h-full">
            {/* Header (Hình đại diện + thông tin chung) */}
            <div className="flex items-center w-full gap-5">
                <div className="relative aspect-square w-40 h-full border-2 border-primary rounded-lg bg-green-50">
                    <Image
                        src={`/logo.png`}
                        alt={`Hình của nhân viên A`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col w-full gap-1.5">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:user-round-pen" className="text-primary size-5" />
                        Nguyễn Văn A
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon={`${randomGender % 2 === 0 ? "tdesign:gender-male" : "tdesign:gender-female"}`} className="text-primary size-5" />
                        {randomGender % 2 === 0 ? "Nam" : "Nữ"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:work-outline" className="text-primary size-5" />
                        Nhân viên quản lý sân - Bán thời gian
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:phone" className="text-primary size-5" />
                        0931000111
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:mail" className="text-primary size-5" />
                        NVA1120@gmail.com
                    </div>
                </div>
                <div className="flex flex-col h-full justify-end">
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
            <div className="flex items-center w-full relative">
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-500"></div>
                {tabs.map((tab, index) => (
                    <div
                        key={`tab-${index}`}
                        className={`w-65 h-full flex justify-center items-center p-4 cursor-pointer border-b-3 relative border-content ${selectedTab === tab ? "border-primary text-primary bg-white" : "border-transparent"}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            {/* Tab Content */}
            {selectedTab === "Thông tin cơ bản" && (
                <div className="flex flex-col gap-10 w-full h-full">
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-id' className="text-xs font-semibold">Mã nhân viên</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-id"
                                type="text"
                                value={`NV1120`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-name' className="text-xs font-semibold">Họ tên nhân viên</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-name"
                                type="text"
                                value={`Nguyễn Văn A`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-dob' className="text-xs font-semibold">Ngày sinh</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-dob"
                                type="date"
                                value={`${new Date()}`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-gender' className="text-xs font-semibold">Giới tính</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-gender"
                                type="text"
                                value={`${randomGender % 2 === 0 ? "Nam" : "Nữ"}`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-phonenumber' className="text-xs font-semibold">Số điện thoại</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-phonenumber"
                                type="text"
                                value={`0931000111`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-email' className="text-xs font-semibold">Email</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-email"
                                type="email"
                                value={`NVA1120@gmail.com`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-address' className="text-xs font-semibold">Địa chỉ</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-address"
                                type="text"
                                value={`Số 1, đường ABC, phường XYZ, quận 1, TP.HCM`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-startday' className="text-xs font-semibold">Ngày bắt đầu làm việc</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-startday"
                                type="date"
                                value={`${new Date()}`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                </div>
            )}
            {selectedTab === "Thông tin ngân hàng" && (
                <div className="flex flex-col gap-5 w-full h-full">
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-cccd' className="text-xs font-semibold">Số CCCD</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-cccd"
                                type="text"
                                value={`012345678910`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-cccdexpireddate' className="text-xs font-semibold">Ngày hết hạn CCCD</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-cccdexpireddate"
                                type="date"
                                value={`${new Date()}`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-taxcode' className="text-xs font-semibold">Mã số thuế</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-taxcode"
                                type="text"
                                value={`0123456789`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="w-full"></div>
                    </div>
                    <div className="flex flex-col gap-2 w-full h-full">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <div className="w-full flex justify-end">
                                <Button variant="outline" className="" disabled={!isEditing} onClick={() => setIsAddDialogOpen(true)}>
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
                                    <Label htmlFor='bank-name' className="text-xs font-semibold">Tên ngân hàng</Label>
                                    <Input
                                        id="bank-name"
                                        type="text"
                                        placeholder="Ngân hàng ABC"
                                        className=""
                                    />
                                    <Label htmlFor='bank-account-number' className="text-xs font-semibold">Số tài khoản</Label>
                                    <Input
                                        id="bank-account-number"
                                        type="text"
                                        placeholder="1234567890"
                                        className=""
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Lưu</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="flex flex-col w-full h-full">
                            <div className="flex items-center w-full">
                                <span className="text-xs font-semibold w-full p-2 border-b-2 border-gray-400">Số tài khoản ngân hàng</span>
                                <span className="text-xs font-semibold w-full p-2 border-b-2 border-gray-400">Tên chủ tài khoảng</span>
                                <span className="text-xs font-semibold w-full p-2 border-b-2 border-gray-400">Tên ngân hàng</span>
                                <span className="text-xs font-semibold w-full p-2 border-b-2 border-gray-400">Tên chi nhánh</span>
                                <span className="text-xs font-semibold w-full text-center flex justify-center p-2 border-b-2 border-gray-400">Được sử dụng</span>
                            </div>
                            <div className="flex flex-col w-full h-full max-h-full overflow-y-auto">
                                {/*Cần thay bằng map*/}
                                <div className="flex items-center w-full">
                                    <div className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">
                                        <MaskedField value="121569835691555" />
                                    </div>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">NGUYEN VAN A</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">MB Bank</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">PGD Hàm Nghi</span>
                                    <span className="p-2 items-center w-full text-center flex justify-center border-b-2 border-gray-200 h-full">
                                        <Icon icon="nrk:check-active" className="text-primary size-5" />
                                    </span>
                                </div>
                                <div className="flex items-center w-full">
                                    <div className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">
                                        <MaskedField value="121569835691555" />
                                    </div>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">NGUYEN VAN A</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">MB Bank</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">PGD Hàm Nghi</span>
                                    <span className="p-2 items-center w-full text-center flex justify-center border-b-2 border-gray-200 h-full">
                                        <Icon
                                            icon="nrk:check-active"
                                            className={`text-primary opacity-0 size-5 ${isEditing ? `cursor-pointer opacity-50 hover:opacity-100` : ``}`}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {selectedTab === "Thông tin lương, thưởng, phạt" && (
                <div className="flex flex-col gap-5 w-full h-full">
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-role' className="text-xs font-semibold">Vai trò</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-role"
                                type="text"
                                value={`Nhân viên quản lý sân`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-type' className="text-xs font-semibold">Loại nhân viên</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-type"
                                type="text"
                                value={`Bán thời gian`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-salary' className="text-xs font-semibold">Lương cơ bản</Label>
                            <Input
                                disabled={!isEditing}
                                id="employee-salary"
                                type="text"
                                value={formatPrice(8000000)}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="w-full"></div>
                    </div>
                    <div className="flex items-center justify-between gap-10 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-monthrewardamount' className="text-xs font-semibold">
                                Tổng tiền thưởng cho {(new Date()).toLocaleDateString("vi-VN", {
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </Label>
                            <Input
                                disabled={true}
                                id="employee-monthrewardamount"
                                type="text"
                                value={`+ ${formatPrice(1000000)}`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor='employee-monthpenaltyamount' className="text-xs font-semibold">
                                Tổng tiền phạt cho {(new Date()).toLocaleDateString("vi-VN", {
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </Label>
                            <Input
                                disabled={true}
                                id="employee-monthpenaltyamount"
                                type="text"
                                value={`- ${formatPrice(500000)}`}
                                onChange={() => { }}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-10 w-full h-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Thưởng của tháng {(new Date().getMonth() + 1)}</span>
                            <div className="flex flex-col gap-2 rounded-lg border-2 border-gray-400 w-full h-full p-2">
                                <div className="flex items-center w-full">
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">05/05/2023</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">Thưởng hiệu suất</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">+ {formatPrice(1000000)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Lỗi phạt của tháng {(new Date().getMonth() + 1)}</span>
                            <div className="flex flex-col gap-2 rounded-lg border-2 border-gray-400 w-full h-full p-2">
                                <div className="flex items-center w-full">
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">05/05/2023</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">Đi trễ</span>
                                    <span className="p-2 flex items-center w-full border-b-2 border-gray-200 h-full">- {formatPrice(50000)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default EmployeeDetails;