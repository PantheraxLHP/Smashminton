// components/EditProfile.tsx
'use client';

import { addressSchema, dobSchema, emailSchema, nameSchema, phoneNumberSchema } from '@/lib/validation.schema';
import { updateProfile } from '@/services/accounts.service';
import { Accounts } from '@/types/types';
import Image from 'next/image';
import React, { useState } from 'react';
import {
    FaBirthdayCake,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPen,
    FaPhone,
    FaTimes,
    FaUser,
    FaVenusMars,
} from 'react-icons/fa';
import { toast } from 'sonner';

interface EditProfileFormData extends Accounts {
    avatar: File | null;
}

interface EditProfileProps {
    userProfile: Accounts;
    onClose: () => void;
    onSave: (updatedUser: Accounts) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ userProfile, onClose, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<EditProfileFormData>({
        ...userProfile,
        avatar: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Function to check if form has been modified
    const isFormModified = (): boolean => {
        // Check if avatar has been changed
        if (formData.avatar !== null) {
            return true;
        }

        // Check other fields for changes
        const fieldsToCheck = ['fullname', 'email', 'phonenumber', 'address', 'gender'] as const;

        for (const field of fieldsToCheck) {
            const currentValue = formData[field] || '';
            const originalValue = userProfile[field] || '';
            if (currentValue !== originalValue) {
                return true;
            }
        }

        // Check dob separately since it might need date comparison
        if (formData.dob || userProfile.dob) {
            const currentDob = formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '';
            const originalDob = userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : '';
            if (currentDob !== originalDob) {
                return true;
            }
        }

        return false;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Real-time validation - only validate if field has content
        validateField(name, value);
    };

    const validateField = (fieldName: string, value: string) => {
        try {
            let schema;
            switch (fieldName) {
                case 'fullname':
                    schema = nameSchema;
                    break;
                case 'email':
                    schema = emailSchema;
                    break;
                case 'phonenumber':
                    schema = phoneNumberSchema;
                    break;
                case 'address':
                    schema = addressSchema;
                    break;
                case 'dob':
                    schema = dobSchema;
                    break;
                default:
                    return; // No validation for other fields
            }

            schema.parse(value);
            setErrors((prev) => ({ ...prev, [fieldName]: '' }));
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || 'Giá trị không hợp lệ';
            setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
        }
    };

    const handleAvatarChange = (e: { target: HTMLInputElement }) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            // Simple file validation
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, avatar: 'Kích thước file không được vượt quá 5MB' }));
                toast.error('Kích thước file không được vượt quá 5MB');
                e.target.value = '';
                return;
            }

            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                setErrors((prev) => ({ ...prev, avatar: 'File phải là định dạng ảnh (JPEG, PNG, WebP)' }));
                toast.error('File phải là định dạng ảnh (JPEG, PNG, WebP)');
                e.target.value = '';
                return;
            }

            setFormData((prev) => ({ ...prev, avatar: file }));
            setErrors((prev) => ({ ...prev, avatar: '' }));
        } else {
            setFormData((prev) => ({ ...prev, avatar: null }));
            setErrors((prev) => ({ ...prev, avatar: '' }));
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!userProfile?.accountid) return;

        // Check if there are any existing validation errors from real-time validation
        const hasErrors = Object.values(errors).some((error) => error !== '' && error !== undefined);
        if (hasErrors) {
            toast.error('Vui lòng sửa các lỗi trước khi lưu');
            return;
        }

        setIsLoading(true);

        const formDataToSend = new FormData();

        // Send all fields, even if empty (let backend handle)
        formDataToSend.append('fullname', formData.fullname || '');
        formDataToSend.append('gender', formData.gender || '');
        formDataToSend.append('email', formData.email || '');
        formDataToSend.append('phonenumber', formData.phonenumber || '');
        formDataToSend.append('address', formData.address || '');

        // Add dob if it exists
        if (formData.dob) {
            const dobDate = new Date(formData.dob);
            formDataToSend.append('dob', dobDate.toISOString());
        }

        if (formData.avatar) {
            formDataToSend.append('avatarurl', formData.avatar);
        }
        else {
            formDataToSend.append('avatarurl', userProfile.avatarurl || '');
        }

        try {
            const response = await updateProfile(userProfile.accountid, formDataToSend);
            if (response.ok) {
                onSave(response.data);
                onClose();
                toast.success('Cập nhật thông tin thành công');
            } else {
                toast.error('Cập nhật thông tin thất bại');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[80vh] w-[95%] max-w-md flex-col rounded-lg bg-white pb-4 shadow-xl sm:w-[90%] md:w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end p-2">
                    <button className="z-10 text-gray-600 hover:text-red-500" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="mr-2 max-h-[80vh] overflow-y-auto">
                    <div className="p-2 md:p-4">
                        <h2 className="text-primary-600 mb-6 text-center text-xl font-semibold">
                            CẬP NHẬT THÔNG TIN CÁ NHÂN
                        </h2>
                        <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-2 h-24 w-24">
                                    {formData.avatar || formData.avatarurl ? (
                                        <Image
                                            src={
                                                formData.avatar
                                                    ? URL.createObjectURL(formData.avatar)
                                                    : formData.avatarurl!
                                            }
                                            alt="Avatar"
                                            className="h-24 w-24 rounded-full border object-cover"
                                            width={96}
                                            height={96}
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-gray-200">
                                            <FaUser className="text-3xl text-gray-500" />
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload">
                                        <div className="absolute right-0 bottom-0 cursor-pointer rounded-full border border-gray-500 bg-gray-200 p-1 hover:bg-gray-300">
                                            <FaPen size={14} />
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FaUser className="text-primary-600" /> Tên
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname || ''}
                                    onChange={handleChange}
                                    placeholder="Nhập tên của bạn"
                                    className={`w-full rounded border px-3 py-1 ${
                                        errors.fullname ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.fullname && (
                                    <span className="mt-1 text-xs text-red-500">{errors.fullname}</span>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FaVenusMars className="text-primary-600" /> Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender || ''}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-1"
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FaPhone className="text-primary-600" /> Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phonenumber"
                                    value={formData.phonenumber || ''}
                                    onChange={handleChange}
                                    placeholder="VD: 0123456789 hoặc +84123456789"
                                    className={`w-full rounded border px-3 py-1 ${
                                        errors.phonenumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.phonenumber && (
                                    <span className="mt-1 text-xs text-red-500">{errors.phonenumber}</span>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FaBirthdayCake className="text-primary-600" /> Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    className={`w-full rounded border px-3 py-1 ${
                                        errors.dob ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.dob && <span className="mt-1 text-xs text-red-500">{errors.dob}</span>}
                                <span className="mt-1 text-xs text-gray-500">Từ 16-100 tuổi</span>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FaMapMarkerAlt className="text-primary-600" /> Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ của bạn"
                                    className={`w-full rounded border px-3 py-1 ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.address && <span className="mt-1 text-xs text-red-500">{errors.address}</span>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FaEnvelope className="text-primary-600" /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className={`w-full rounded border px-3 py-1 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && <span className="mt-1 text-xs text-red-500">{errors.email}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="c mt-6 flex justify-end gap-2 pr-4">
                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded border px-4 py-2 text-gray-600 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !isFormModified()}
                            className="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
