import { Icon } from '@iconify/react';
import { useState } from 'react';
import Image from 'next/image';

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
                <div className="flex w-full h-full">
                    Content tab Thông tin cơ bản
                </div>
            )}
            {selectedTab === "Thông tin ngân hàng" && (
                <div className="flex w-full h-full">
                    Content tab Thông tin ngân hàng
                </div>
            )}
            {selectedTab === "Thông tin lương, thưởng, phạt" && (
                <div className="flex w-full h-full">
                    Content tab Thông tin lương, thưởng, phạt
                </div>
            )}
        </div >
    );
}

export default EmployeeDetails;