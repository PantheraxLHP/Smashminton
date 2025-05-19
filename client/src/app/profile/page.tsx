'use client';

import React, { useState, useEffect } from 'react';
import { FaUser, FaVenusMars, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { MdOutlineSportsTennis } from 'react-icons/md';
import Link from 'next/link'; // Import Link from next/link
import EditProfile from './EditProfile';
import { useSearchParams, useRouter } from 'next/navigation';

interface User {
    name: string;
    gender: string;
    phone: string;
    address: string;
    email: string;
}

interface Booking {
    time: string;
    phone: string;
    person: string;
    court: string;
    price: string;
}

const user: User = {
    name: 'Nguyễn Văn Vun',
    gender: 'Nam',
    phone: '0931000111',
    address: '141 Trần Phú',
    email: 'NVA1120@gmail.com',
};

const upcomingBookings: Booking[] = [
    {
        time: '09:00 - 11:00',
        phone: '0123345434',
        person: 'A. Phú',
        court: 'Sân 3 (Zone A)',
        price: '180,000 VNĐ',
    },
    {
        time: '11:00 - 13:00',
        phone: '0123345435',
        person: 'B. Minh',
        court: 'Sân 4 (Zone B)',
        price: '200,000 VNĐ',
    },
    {
        time: '15:00 - 17:00',
        phone: '0123345235',
        person: 'B. Nhat',
        court: 'Sân 4 (Zone B)',
        price: '180,000 VNĐ',
    },
];

const pastBookings: Booking[] = [
    {
        time: '09:00 - 11:00',
        phone: '0123345434',
        person: 'A. Phú',
        court: 'Sân 1 (Zone A)',
        price: '180,000 VNĐ',
    },
    {
        time: '11:00 - 13:00',
        phone: '0123345435',
        person: 'B. Minh',
        court: 'Sân 2 (Zone B)',
        price: '200,000 VNĐ',
    },
];


const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [mounted, setMounted] = useState(false); // To ensure client-side rendering
    const [isStudentStatusUpdated, setIsStudentStatusUpdated] = useState(false);
    const [showStudentPopup, setShowStudentPopup] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [userInfo, setUserInfo] = useState(user);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Ensure that component is only mounted on client-side
    useEffect(() => {
        setMounted(true);
        const tabParam = searchParams.get('tab');
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, []);

    // Don't render the component until mounted
    if (!mounted) {
        return null;
    }

    const handleUpdateStudentStatus = () => {
        setIsStudentStatusUpdated(true);
        setShowStudentPopup(false);
    };


    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);

        // Xoá ?tab=... khỏi URL
        const params = new URLSearchParams(window.location.search);
        params.delete('tab');

        const newPath = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        router.replace(newPath);
    };
    

    return (
        <div className="min-h-screen bg-full bg-center p-8" style={{ backgroundImage: 'url(homebg.png)' }}>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-2xl">
                {/* Profile Section */}
                <div className="flex items-start gap-6 border-b pb-6">
                    <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-4xl">
                        <FaUser />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaUser className="text-primary-600" /> {user.name}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaVenusMars className="text-primary-600" /> {user.gender}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaPhone className="text-primary-600" /> {user.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaMapMarkerAlt className="text-primary-600" /> {user.address}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaEnvelope className="text-primary-600" /> {user.email}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded"
                            onClick={() => setShowEditProfile(true)}
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b mt-4 text-sm font-semibold">
                    <button
                        onClick={() => handleTabClick('upcoming')}
                        className={`py-2 ${activeTab === 'upcoming' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Sân & Dịch vụ sắp diễn ra
                    </button>
                    <button
                        onClick={() => handleTabClick('past')}
                        className={`py-2 ${activeTab === 'past' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Sân & Dịch vụ đã sử dụng
                    </button>
                    <button
                        onClick={() => handleTabClick('student')}
                        className={`py-2 ${activeTab === 'student' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Học sinh/Sinh viên
                    </button>
                    <button
                        onClick={() => handleTabClick('changepassword')}
                        className={`py-2 ${activeTab === 'changepassword' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Thay đổi mật khẩu
                    </button>
                </div>

                {/* Content for "Sân & Dịch vụ sắp diễn ra" */}
                {activeTab === 'upcoming' && (
                    <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map((booking, index) => (
                                <div key={index} className="border rounded p-4 shadow-sm relative border-primary-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">{booking.time}</p>
                                            <div className="flex items-center gap-2 mt-2 text-gray-700 text-sm">
                                                <FaPhone className="text-gray-400" /> {booking.phone} ({booking.person})
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-gray-700 text-sm">
                                                <MdOutlineSportsTennis className="text-gray-400" /> {booking.court}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm font-bold text-black">
                                            {booking.price}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-600 flex items-center justify-center gap-2">
                                <p>Chưa có lịch đặt sân...</p>
                                <Link href="/booking">
                                    <p className="hover:text-primary-700 text-primary-600 cursor-pointer">
                                        Đặt sân ngay →
                                    </p>
                                </Link>
                            </div>

                        )}
                    </div>
                )}

                {/* Content for "Sân & Dịch vụ đã sử dụng" */}
                {activeTab === 'past' && (
                    <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
                        {pastBookings.length > 0 ? (
                            pastBookings.map((booking, index) => (
                                <div key={index} className="border rounded p-4 shadow-sm relative border-gray-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">{booking.time}</p>
                                            <div className="flex items-center gap-2 mt-2 text-gray-700 text-sm">
                                                <FaPhone className="text-gray-400" /> {booking.phone} ({booking.person})
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-gray-700 text-sm">
                                                <MdOutlineSportsTennis className="text-gray-400" /> {booking.court}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm font-bold text-black">
                                            {booking.price}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-600">
                                <p>Chưa có lịch sử đặt sân...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Content for "Học sinh/Sinh viên" */}
                {activeTab === 'student' && (
                    <div className="mt-4 text-center text-gray-600">
                        {isStudentStatusUpdated ? (
                            <p>Tình trạng học sinh/sinh viên đã được cập nhật.</p>
                        ) : (
                                <>
                                    <div className="text-center text-gray-600 flex items-center justify-center gap-2">
                                        <p> Chưa cập nhật tình trạng học sinh/sinh viên...</p>
                                        <button
                                            onClick={() => setShowStudentPopup(true)}
                                            className="hover:text-primary-700 text-primary-600 cursor-pointer"
                                        >
                                            Cập nhật ngay →
                                        </button>
                                    </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'changepassword' && (
                    <div className="flex justify-center">
                        <div className="mt-4 space-y-4 max-w-md w-full">
                            <div>
                                <label className="block font-medium text-md py-2">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-md py-2">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <button
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded cursor-pointer"
                            >
                                Xác nhận thay đổi mật khẩu
                            </button>
                        </div>
                    </div>
                )}




                {/* Popup to Update Student Status */}
                {showStudentPopup && (
                    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-2xl max-w-sm w-full">
                            <h3 className="font-semibold text-lg mb-4">Cập nhật tình trạng học sinh/sinh viên</h3>
                            {/* Add your form fields or content to update the status here */}
                            <button
                                onClick={handleUpdateStudentStatus}
                                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                Cập nhật
                            </button>
                            <button
                                onClick={() => setShowStudentPopup(false)}
                                className="mt-2 text-gray-600 hover:text-gray-800"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}

            </div>
            {showEditProfile && (
                <EditProfile
                    user={userInfo}
                    onClose={() => setShowEditProfile(false)}
                    onSave={(updatedUser) => {
                        setUserInfo(updatedUser);
                    }}
                />
            )}
        </div>
    );
};

export default UserProfilePage;
