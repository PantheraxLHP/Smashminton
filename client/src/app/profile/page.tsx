'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa';
import EditProfile from './EditProfile';
import UserReceipts from './UserReceipts';
import { updatePassword, updateStudentCard } from '@/services/accounts.service';
import { toast } from 'sonner';
import { getReceiptDetail } from '@/services/receipts.service';

// Types for the API data
interface Product {
    productid: number;
    productname: string;
    quantity: number;
}

interface Rental {
    productid: number;
    productname: string;
    quantity: number;
    rentaldate: string;
}

interface Court {
    starttime: string;
    endtime: string;
    duration: string;
    date: string;
    zone: string;
    guestphone: string;
    totalamount: string;
    products: Product[];
    rentals: Rental[];
}

interface Receipt {
    receiptid: number;
    paymentmethod: string;
    totalamount: string;
    courts: Court[];
}

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [isStudentStatusUpdated, setIsStudentStatusUpdated] = useState(
        user?.studentCard?.studentcardid ? true : false,
    );
    const userProfile = user;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
    const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);

    useEffect(() => {
        const fetchUserReceipts = async () => {
            setIsLoadingReceipts(true);
            try {
                const customerid = user?.accounttype === 'Customer' ? user?.accountid : 0;
                const employeeid = user?.accounttype === 'Employee' ? user?.accountid : 0;

                const response = await getReceiptDetail(customerid, employeeid);
                if (response.ok) {
                    // Ensure the data is an array
                    const receiptsData = Array.isArray(response.data) ? response.data : [];
                    setReceipts(receiptsData);
                } else {
                    toast.error(response.message || 'Không thể tải danh sách đơn hàng');
                }
            } catch (error) {
                console.error('Error fetching receipts:', error);
                toast.error('Không thể tải lịch sử đặt sân');
            } finally {
                setIsLoadingReceipts(false);
            }
        };

        if (user?.accountid) {
            fetchUserReceipts();
        }
    }, [user?.accountid]);

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
            formData.append('files', frontImage);
            formData.append('files', backImage);

            const response = await updateStudentCard(userProfile?.accountid || 0, formData);

            if (response.ok) {
                toast.success('Tình trạng học sinh/sinh viên đã được cập nhật');
                setFrontImage(null);
                setBackImage(null);
                setFrontImagePreview(null);
                setBackImagePreview(null);
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi cập nhật');
            }
        } catch (error) {
            console.error('Error uploading student card:', error);
            toast.error('Có lỗi xảy ra khi cập nhật');
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
                        onClick={() => handleTabClick('bookings')}
                        className={`py-2 ${activeTab === 'bookings' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Lịch sử Sân & Dịch vụ
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

                {/* Content for "Lịch sử Sân & Dịch vụ" */}
                {activeTab === 'bookings' && (
                    <div className="mt-4 max-h-80 overflow-y-auto">
                        {isLoadingReceipts ? (
                            <div className="flex items-center justify-center p-8 text-gray-500">
                                <div className="text-center">
                                    <div className="border-primary-600 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                                    <span className="text-lg">Đang tải lịch sử đặt sân...</span>
                                </div>
                            </div>
                        ) : receipts.length === 0 ? (
                            <div className="flex items-center justify-center gap-2 p-8 text-center text-gray-600">
                                <div>
                                    <p className="mb-2">Chưa có lịch đặt sân...</p>
                                    <Link href="/booking">
                                        <p className="hover:text-primary-700 text-primary-600 cursor-pointer">
                                            Đặt sân ngay →
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <UserReceipts receipts={receipts} />
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
                                                width={400}
                                                height={128}
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
                                                width={400}
                                                height={128}
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
