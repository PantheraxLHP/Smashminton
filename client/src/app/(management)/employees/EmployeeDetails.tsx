import { Icon } from '@iconify/react';
import { useState } from 'react';
import Image from 'next/image';
import MaskedField from '@/components/atomic/MaskedField';
import { formatPrice } from '@/lib/utils';

const EmployeeDetails = () => {
    const [randomGender, setRandomGender] = useState<number>(Math.floor(Math.random() * 2 + 1));
    const tabs = ["Thông tin cơ bản", "Thông tin ngân hàng", "Thông tin lương, thưởng, phạt"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

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
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Mã nhân viên</span>
                            <span className="">NV001</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Họ tên</span>
                            <span className="">Nguyễn Văn A</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Ngày sinh</span>
                            <span className="">
                                {(new Date()).toLocaleDateString("vi-VN", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Giới tính</span>
                            <span className="">{randomGender % 2 === 0 ? "Nam" : "Nữ"}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Số điện thoại liên lạc</span>
                            <span className="">0931000111</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Email</span>
                            <span className="">NVA1120@email.mail</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Địa chỉ</span>
                            <span className="">Số 1, đường ABC, phường XYZ, quận 1, TP.HCM</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Ngày bắt đầu làm việc</span>
                            <span className="">
                                {(new Date()).toLocaleDateString("vi-VN", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Số CCCD</span>
                            <span className="">012345678910</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Mã số thuế</span>
                            <span className="">0123456789</span>
                        </div>
                    </div>
                </div>
            )}
            {selectedTab === "Thông tin ngân hàng" && (
                <div className="flex flex-col gap-5 w-full h-full">
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Số CCCD</span>
                            <span className="">012345678910</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Ngày hết hạn CCCD</span>
                            <span className="">
                                {(new Date()).toLocaleDateString("vi-VN", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs font-semibold">Mã số thuế</span>
                        <span className="">0123456789</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs font-semibold">Số tài khoản ngân hàng</span>
                        <MaskedField value="121569835691555" />
                    </div>
                </div>

            )}
            {selectedTab === "Thông tin lương, thưởng, phạt" && (
                <div className="flex flex-col gap-5 w-full h-full">
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Vai trò</span>
                            <span className="">Nhân viên quản lý sân</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">Loại nhân viên</span>
                            <span className="">Bán thời gian</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs font-semibold">Lương cơ bản</span>
                        <span className="">{formatPrice(8000000)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">
                                Tổng tiền thưởng cho tháng {(new Date().getMonth() + 1)}
                            </span>
                            <span className="">+ {formatPrice(1000000)}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold">
                                Tổng tiền phạt cho tháng {(new Date().getMonth() + 1)}
                            </span>
                            <span className="">- {formatPrice(500000)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default EmployeeDetails;