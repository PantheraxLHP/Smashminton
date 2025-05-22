'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link'; // Import Link from next/link
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa';
import { MdOutlineSportsTennis } from 'react-icons/md';
import EditProfile from './EditProfile';
import { Accounts } from '@/types/types';
import { getUser } from '@/services/accounts.service';
import Image from 'next/image';

interface Booking {
    time: string;
    phone: string;
    person: string;
    court: string;
    price: string;
}

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
    const [userProfile, setUserProfile] = useState<Accounts>();
    const [isStudentStatusUpdated, setIsStudentStatusUpdated] = useState(false);
    const [showStudentPopup, setShowStudentPopup] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.sub) return;
            const accountId = user.sub;
            const response = await getUser(accountId);
            if (response.ok) {
                setUserProfile(response.data);
            }
        };
        fetchUserProfile();
    }, []);

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
        <div className="bg-full min-h-screen bg-center p-8" style={{ backgroundImage: 'url(homebg.png)' }}>
            <div className="mx-auto max-w-4xl rounded bg-white p-6 shadow-2xl">
                {/* Profile Section */}
                <div className="flex items-start gap-6 border-b pb-6">
                    {userProfile?.avatarurl ? (
                        <Image
                            src={userProfile.avatarurl}
                            alt="User Avatar"
                            className="h-28 w-28 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 text-4xl text-gray-400">
                            <FaUser />
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaUser className="text-primary-600" /> {userProfile?.fullname}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaVenusMars className="text-primary-600" /> {userProfile?.gender}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaPhone className="text-primary-600" /> {userProfile?.phonenumber}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaMapMarkerAlt className="text-primary-600" /> {userProfile?.address}
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaEnvelope className="text-primary-600" /> {userProfile?.email}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 font-semibold text-white"
                            onClick={() => setShowEditProfile(true)}
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex gap-8 border-b text-sm font-semibold">
                    <button
                        onClick={() => handleTabClick('upcoming')}
                        className={`py-2 ${activeTab === 'upcoming' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Sân & Dịch vụ sắp diễn ra
                    </button>
                    <button
                        onClick={() => handleTabClick('past')}
                        className={`py-2 ${activeTab === 'past' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Sân & Dịch vụ đã sử dụng
                    </button>
                    <button
                        onClick={() => handleTabClick('student')}
                        className={`py-2 ${activeTab === 'student' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Học sinh/Sinh viên
                    </button>
                    <button
                        onClick={() => handleTabClick('changepassword')}
                        className={`py-2 ${activeTab === 'changepassword' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Thay đổi mật khẩu
                    </button>
                </div>

                {/* Content for "Sân & Dịch vụ sắp diễn ra" */}
                {activeTab === 'upcoming' && (
                    <div className="mt-4 max-h-80 space-y-4 overflow-y-auto">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map((booking, index) => (
                                <div key={index} className="border-primary-500 relative rounded border p-4 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{booking.time}</p>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                                                <FaPhone className="text-gray-400" /> {booking.phone} ({booking.person})
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                                                <MdOutlineSportsTennis className="text-gray-400" /> {booking.court}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm font-bold text-black">{booking.price}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-center text-gray-600">
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
                    <div className="mt-4 max-h-80 space-y-4 overflow-y-auto">
                        {pastBookings.length > 0 ? (
                            pastBookings.map((booking, index) => (
                                <div key={index} className="relative rounded border border-gray-500 p-4 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{booking.time}</p>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                                                <FaPhone className="text-gray-400" /> {booking.phone} ({booking.person})
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                                                <MdOutlineSportsTennis className="text-gray-400" /> {booking.court}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm font-bold text-black">{booking.price}</div>
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
                                <div className="flex items-center justify-center gap-2 text-center text-gray-600">
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
                        <div className="mt-4 w-full max-w-md space-y-4">
                            <div>
                                <label className="text-md block py-2 font-medium">Mật khẩu mới</label>
                                <input type="password" name="password" className="w-full rounded border px-3 py-2" />
                            </div>

                            <div>
                                <label className="text-md block py-2 font-medium">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full rounded border px-3 py-2"
                                />
                            </div>

                            <button className="bg-primary-600 hover:bg-primary-700 w-full cursor-pointer rounded px-4 py-2 font-semibold text-white">
                                Xác nhận thay đổi mật khẩu
                            </button>
                        </div>
                    </div>
                )}

                {/* Popup to Update Student Status */}
                {showStudentPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                        <div className="w-full max-w-sm rounded bg-white p-6 shadow-2xl">
                            <h3 className="mb-4 text-lg font-semibold">Cập nhật tình trạng học sinh/sinh viên</h3>
                            {/* Add your form fields or content to update the status here */}
                            <button
                                onClick={handleUpdateStudentStatus}
                                className="bg-primary-600 hover:bg-primary-700 rounded px-4 py-2 font-semibold text-white"
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
                    userProfile={userProfile!}
                    onClose={() => setShowEditProfile(false)}
                    onSave={(updatedUser) => {
                        setUserProfile(updatedUser);
                    }}
                />
            )}
        </div>
    );
};

export default UserProfilePage;
