'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa';
import EditProfile from './EditProfile';
import UserReceipts from './UserReceipts';
import { updatePassword, updateStudentCard } from '@/services/accounts.service';
import { toast } from 'sonner';
import { getReceiptDetail } from '@/services/receipts.service';
import { Icon } from '@iconify/react';
import { passwordChangeSchema, getValidationErrors } from '@/lib/validation.schema';

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
    // Fix: Set default activeTab based on user role
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState(() => {
        if (user?.role === 'Admin') {
            return 'changepassword';
        }
        return 'bookings';
    });

    const [showEditProfile, setShowEditProfile] = useState(false);
    const router = useRouter();
    const [isStudentStatusUpdated, setIsStudentStatusUpdated] = useState(
        user?.studentCard?.studentcardid ? true : false,
    );
    const userProfile = user;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Updated state for single image
    const [studentImage, setStudentImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchUserReceipts = async () => {
            setIsLoadingReceipts(true);
            try {
                const customerid = user?.accounttype === 'Customer' ? user?.accountid : 0;
                const employeeid = user?.role === 'employee' ? user?.accountid : 0;

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

        // Fix: Only fetch receipts for Customer and Employee users
        if (user?.accountid && (user?.accounttype === 'Customer' || user?.role === 'employee')) {
            fetchUserReceipts();
        }
    }, [user?.accountid, user?.accounttype, user?.role]);

    // Updated image upload handler for single image
    const handleImageUpload = (file: File) => {
        setStudentImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    // Updated student status handler for single image
    const handleUpdateStudentStatus = async () => {
        if (!studentImage) {
            toast.error('Vui lòng tải lên hình ảnh thẻ sinh viên');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('files', studentImage);

            const response = await updateStudentCard(userProfile?.accountid || 0, formData);

            if (response.ok) {
                toast.success('Tình trạng học sinh/sinh viên đã được cập nhật');
                setStudentImage(null);
                setImagePreview(null);
                setIsEditing(false);
                window.location.reload();
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

    // Updated image change handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn một file ảnh hợp lệ');
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB');
                return;
            }

            handleImageUpload(file);
        }
    };

    // Updated cancel function
    const handleCancel = () => {
        setStudentImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        setIsEditing(false);

        // Reset the specific file input
        const fileInput = document.getElementById('student-card-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
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

        // Validate password data
        try {
            passwordChangeSchema.parse({
                newPassword,
                confirmPassword,
            });
            setPasswordErrors({});
        } catch (error: any) {
            const validationErrors = getValidationErrors(error);
            setPasswordErrors(validationErrors);
            toast.error('Vui lòng sửa các lỗi trong mật khẩu');
            return;
        }

        setIsSubmitting(true);

        try {
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
                // Reset form
                (e.target as HTMLFormElement).reset();
                setPasswordErrors({});
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        setImagePreview(null);
        setStudentImage(null);
    }, [activeTab]);

    return (
        <div className="flex max-h-screen min-h-screen w-full justify-center bg-[url('/default.png')] bg-cover bg-center px-4 sm:px-10 md:px-20 lg:px-35 py-10">
            <div className="w-full rounded bg-white p-4 sm:p-6 shadow-2xl overflow-y-auto">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b pb-6">
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
                    <div className="mt-4 sm:mt-0 sm:ml-auto">
                        <button
                            className="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded px-4 py-2 font-semibold text-white"
                            onClick={() => setShowEditProfile(true)}
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex gap-6 overflow-x-auto whitespace-nowrap border-b text-sm font-semibold">
                    {(user?.accounttype === 'Customer' || user?.role === 'employee') && (
                        <button
                            onClick={() => handleTabClick('bookings')}
                            className={`py-2 ${activeTab === 'bookings' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                        >
                            Lịch sử Sân & Dịch vụ
                        </button>
                    )}
                    {user?.accounttype === 'Customer' && (
                        <button
                            onClick={() => handleTabClick('student')}
                            className={`py-2 ${activeTab === 'student' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                        >
                            Học sinh/Sinh viên
                        </button>
                    )}

                    <button
                        onClick={() => handleTabClick('changepassword')}
                        className={`py-2 ${activeTab === 'changepassword' ? 'border-primary-600 text-primary-600 border-b-2' : 'text-gray-500'} hover:text-primary-600 cursor-pointer`}
                    >
                        Thay đổi mật khẩu
                    </button>
                </div>

                {/* Content for "Lịch sử Sân & Dịch vụ" */}
                {activeTab === 'bookings' && (
                    <div className="mt-4 max-h-[45vh] overflow-y-auto sm:max-h-[50vh]">
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

                {/* Updated Student Tab Content */}
                {activeTab === 'student' && (
                    <div className="mt-4">
                        {isStudentStatusUpdated ? (
                            <div className="text-primary-600 flex flex-col items-center justify-center gap-4 text-center font-semibold">
                                <span>Bạn đã được ghi nhận là học sinh/sinh viên.</span>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`bg-primary-600 hover:bg-primary-700 w-fit rounded px-4 py-2 font-semibold text-white ${isEditing ? 'hidden' : ''}`}
                                >
                                    Cập nhật thẻ sinh viên
                                </button>
                            </div>
                        ) : (
                            <div className="mx-auto max-w-md">
                                <h3 className="mb-4 text-lg font-semibold">Xác minh thẻ sinh viên</h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Vui lòng tải lên hình ảnh thẻ sinh viên để xác minh.
                                </p>

                                {/* Simplified Image Upload */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Thẻ sinh viên
                                    </label>

                                    {/* Custom File Input */}
                                    <div className="group relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 hidden cursor-pointer opacity-0"
                                            id="student-upload"
                                        />
                                        <label
                                            htmlFor="student-upload"
                                            className="flex w-full cursor-pointer items-center justify-between gap-10 rounded text-sm text-gray-500"
                                        >
                                            <span className="bg-primary-50 text-primary-700 group-hover:bg-primary-100 flex w-30 justify-center rounded-full px-2 py-1 font-medium">
                                                Chọn file ảnh
                                            </span>
                                            {studentImage ? (
                                                <span className="text-green-600">✓ Đã chọn: {studentImage.name}</span>
                                            ) : (
                                                <span>Chưa chọn file nào</span>
                                            )}
                                        </label>
                                    </div>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mt-3">
                                            <div className="relative mx-auto aspect-[3/2] w-full max-w-sm overflow-hidden rounded-lg border">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Student card preview"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {imagePreview && (
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 rounded border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                    )}
                                    <button
                                        onClick={handleUpdateStudentStatus}
                                        disabled={isSubmitting || !studentImage}
                                        className="bg-primary-600 hover:bg-primary-700 flex-1 rounded px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Đang tải lên...' : 'Gửi xác minh'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Update Section for Already Verified Users */}
                        {isStudentStatusUpdated && isEditing && (
                            <div className="mx-auto mt-1 max-w-md rounded-lg border bg-gray-50 p-2">
                                <h4 className="mb-2 text-lg font-semibold">Cập nhật thẻ sinh viên</h4>

                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Chọn ảnh thẻ sinh viên mới
                                    </label>

                                    {/* Custom File Upload Button */}
                                    <div className="flex flex-col gap-4">
                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="student-card-input"
                                        />

                                        {/* Custom Button that triggers file input */}
                                        <label
                                            htmlFor="student-card-input"
                                            className="flex w-full cursor-pointer items-center justify-between gap-10 rounded text-sm text-gray-500"
                                        >
                                            <span className="bg-primary-50 text-primary-700 group-hover:bg-primary-100 flex w-30 justify-center rounded-full px-2 py-1 font-medium">
                                                Chọn file ảnh
                                            </span>
                                            {studentImage ? (
                                                <span className="text-green-600">✓ Đã chọn: {studentImage.name}</span>
                                            ) : (
                                                <span>Chưa chọn file nào</span>
                                            )}
                                        </label>
                                    </div>

                                    {/* Image Preview for Update */}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <div className="relative mx-auto aspect-[3/2] w-full max-w-sm overflow-hidden rounded-lg border">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Student card preview"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 rounded border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleUpdateStudentStatus}
                                        disabled={isSubmitting || !studentImage}
                                        className="bg-primary-600 hover:bg-primary-700 flex-1 rounded px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'changepassword' && (
                    <div className="flex justify-center px-2">
                        <form className="mt-4 w-full max-w-md space-y-4" onSubmit={handleChangePassword}>
                            <div>
                                <label className="block py-2 text-sm font-medium">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className={`w-full rounded border px-3 py-2 ${
                                        passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    autoComplete="new-password"
                                />
                                {passwordErrors.newPassword && (
                                    <span className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</span>
                                )}
                            </div>

                            <div>
                                <label className="block py-2 text-sm font-medium">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className={`w-full rounded border px-3 py-2 ${
                                        passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    autoComplete="new-password"
                                />
                                {passwordErrors.confirmPassword && (
                                    <span className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</span>
                                )}
                            </div>

                            <button
                                disabled={isSubmitting || Object.values(passwordErrors).some((error) => error !== '')}
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 w-full cursor-pointer rounded px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang thay đổi...' : 'Xác nhận thay đổi mật khẩu'}
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
