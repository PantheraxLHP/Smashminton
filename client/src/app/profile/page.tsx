'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa';
import { MdOutlineSportsTennis } from 'react-icons/md';
import EditProfile from './EditProfile';
import { updatePassword } from '@/services/accounts.service';
import { toast } from 'sonner';

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
    const [isStudentStatusUpdated, setIsStudentStatusUpdated] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
    const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
    const userProfile = user;

    const handleImageUpload = (file: File, type: 'front' | 'back') => {
        if (type === 'front') {
            setFrontImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setFrontImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setBackImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setBackImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateStudentStatus = async () => {
        if (!frontImage || !backImage) {
            toast.error('Vui lòng tải lên cả hai mặt của thẻ sinh viên');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('frontImage', frontImage);
            formData.append('backImage', backImage);
            formData.append('accountId', String(userProfile?.accountid || ''));

            // Replace this URL with your actual API endpoint
            const response = await fetch('/api/student-verification', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setIsStudentStatusUpdated(true);
                toast.success('Thẻ sinh viên đã được gửi để xác minh');
                // Reset form
                setFrontImage(null);
                setBackImage(null);
                setFrontImagePreview(null);
                setBackImagePreview(null);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Có lỗi xảy ra khi tải lên');
            }
        } catch (error) {
            console.error('Error uploading student card:', error);
            toast.error('Có lỗi xảy ra khi tải lên');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);

        // Xoá ?tab=... khỏi URL
        const params = new URLSearchParams(window.location.search);
        params.delete('tab');

        const newPath = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        router.replace(newPath);
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        setIsSubmitting(true);
        const response = await updatePassword(userProfile?.accountid, {
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        });

        if (!response.ok) {
            toast.error(response.message);
            return;
        }

        if (response.ok) {
            toast.success('Mật khẩu đã được thay đổi thành công');
        }
        setIsSubmitting(false);
    };
    return (
        <div className="min-h-screen bg-[url('/default.png')] bg-cover bg-center p-8">
            <div className="mx-auto max-w-4xl rounded bg-white p-6 shadow-2xl">
                {/* Profile Section */}
                <div className="flex items-start gap-6 border-b pb-6">
                    {userProfile?.avatarurl ? (
                        <Image
                            src={userProfile.avatarurl}
                            alt="User Avatar"
                            width={112}
                            height={112}
                            className="h-28 w-28 rounded-full border object-cover"
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
                                <FaBirthdayCake className="text-primary-600" />{' '}
                                {userProfile?.dob ? new Date(userProfile.dob).toLocaleDateString() : ''}
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
                            className="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded px-4 py-2 font-semibold text-white"
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
                    <div className="mt-4">
                        {isStudentStatusUpdated ? (
                            <div className="text-center text-gray-600">
                                <p>Tình trạng học sinh/sinh viên đã được cập nhật.</p>
                            </div>
                        ) : (
                            <div className="mx-auto max-w-md">
                                <h3 className="mb-4 text-lg font-semibold">Xác minh thẻ sinh viên</h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Vui lòng tải lên hình ảnh mặt trước và mặt sau của thẻ sinh viên để xác minh.
                                </p>

                                {/* Front Image Upload */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Mặt trước thẻ sinh viên
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'front');
                                        }}
                                        className="file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                                    />
                                    {frontImagePreview && (
                                        <div className="mt-2">
                                            <Image
                                                src={frontImagePreview}
                                                alt="Front preview"
                                                className="h-32 w-full rounded border object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Back Image Upload */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Mặt sau thẻ sinh viên
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'back');
                                        }}
                                        className="file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                                    />
                                    {backImagePreview && (
                                        <div className="mt-2">
                                            <Image
                                                src={backImagePreview}
                                                alt="Back preview"
                                                className="h-32 w-full rounded border object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleUpdateStudentStatus}
                                    disabled={isSubmitting || !frontImage || !backImage}
                                    className="bg-primary-600 hover:bg-primary-700 w-full rounded px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {isSubmitting ? 'Đang tải lên...' : 'Gửi xác minh'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'changepassword' && (
                    <div className="flex justify-center">
                        <form className="mt-4 w-full max-w-md space-y-4" onSubmit={handleChangePassword}>
                            <div>
                                <label className="block py-2 text-sm font-medium">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="w-full rounded border px-3 py-2"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label className="block py-2 text-sm font-medium">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full rounded border px-3 py-2"
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 w-full cursor-pointer rounded px-4 py-2 font-semibold text-white"
                            >
                                Xác nhận thay đổi mật khẩu
                            </button>
                        </form>
                    </div>
                )}
            </div>
            {showEditProfile && (
                <EditProfile
                    userProfile={userProfile!}
                    onClose={() => setShowEditProfile(false)}
                    onSave={(updatedUser) => {
                        setUser(updatedUser);
                    }}
                />
            )}
        </div>
    );
};

export default UserProfilePage;
