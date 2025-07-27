// components/EditProfile.tsx
'use client';

import { User } from '@/context/AuthContext';
import { updateProfile } from '@/services/accounts.service';
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
import { z } from 'zod';
import {
    profileEditSchema,
    nameSchema,
    phoneNumberSchema,
    emailSchema,
    addressSchema,
    dobSchema,
    imageFileSchema,
    sanitizeString,
    sanitizeEmail,
    sanitizePhone,
    getValidationErrors,
} from '@/lib/validation.schema';

interface EditProfileFormData extends User {
    avatar: File | null;
}

interface EditProfileProps {
    userProfile: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
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

        // Sanitize input based on field type
        let sanitizedValue = value;
        if (name === 'email') {
            sanitizedValue = sanitizeEmail(value);
        } else if (name === 'phonenumber') {
            sanitizedValue = sanitizePhone(value);
        } else if (name === 'fullname') {
            sanitizedValue = sanitizeString(value);
        } else if (name === 'address') {
            sanitizedValue = sanitizeString(value);
        }

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

        // Real-time validation
        validateField(name, sanitizedValue);
    };

    const validateField = (fieldName: string, value: string) => {
        try {
            let schema;
            switch (fieldName) {
                case 'fullname':
                    schema = nameSchema.optional();
                    break;
                case 'email':
                    schema = emailSchema.optional();
                    break;
                case 'phonenumber':
                    schema = phoneNumberSchema.optional();
                    break;
                case 'address':
                    schema = z.string().min(1, 'Địa chỉ không được để trống').max(500, 'Địa chỉ quá dài');
                    break;
                case 'dob':
                    schema = dobSchema.optional();
                    break;
                default:
                    return; // No validation for other fields
            }

            if (value === '' && fieldName !== 'fullname' && fieldName !== 'email' && fieldName !== 'address') {
                // Allow empty values for optional fields (except fullname, email, and address)
                setErrors((prev) => ({ ...prev, [fieldName]: '' }));
                return;
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
            try {
                imageFileSchema.parse(file);
                setFormData((prev) => ({ ...prev, avatar: file }));
                setErrors((prev) => ({ ...prev, avatar: '' }));
            } catch (error: any) {
                const errorMessage = error.errors?.[0]?.message || 'File không hợp lệ';
                setErrors((prev) => ({ ...prev, avatar: errorMessage }));
                toast.error(errorMessage);
                // Reset file input
                e.target.value = '';
            }
        } else {
            setFormData((prev) => ({ ...prev, avatar: null }));
            setErrors((prev) => ({ ...prev, avatar: '' }));
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!userProfile?.accountid) return;

        // Only validate fields that will actually be sent to the backend
        try {
            const validationData: any = {};

            // Only validate fields that have been modified or are required
            if (formData.fullname && formData.fullname !== (userProfile.fullname || '')) {
                validationData.fullname = formData.fullname;
            }

            if (formData.email && formData.email !== (userProfile.email || '')) {
                validationData.email = formData.email;
            }

            // Only validate phone number if it has a value and has been changed
            if (formData.phonenumber && formData.phonenumber !== (userProfile.phonenumber || '')) {
                validationData.phonenumber = formData.phonenumber;
            }

            // Address is always validated since it's required by API
            validationData.address = formData.address || '';

            if (formData.dob) {
                const currentDob = formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '';
                const originalDob = userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : '';
                if (currentDob !== originalDob) {
                    validationData.dob = formData.dob;
                }
            }

            if (formData.gender && formData.gender !== (userProfile.gender || '')) {
                validationData.gender = formData.gender as 'Nam' | 'Nữ' | 'Khác';
            }

            // Create a dynamic schema based on what fields we're actually updating
            const dynamicSchema = z.object({
                ...(validationData.fullname !== undefined && { fullname: nameSchema }),
                ...(validationData.email !== undefined && { email: emailSchema }),
                ...(validationData.phonenumber !== undefined && { phonenumber: phoneNumberSchema }),
                ...(validationData.address !== undefined && {
                    address: z.string().min(1, 'Địa chỉ không được để trống').max(500, 'Địa chỉ quá dài'),
                }),
                ...(validationData.dob !== undefined && { dob: dobSchema }),
                ...(validationData.gender !== undefined && { gender: z.enum(['Nam', 'Nữ', 'Khác']) }),
            });

            dynamicSchema.parse(validationData);

            // Check if there are any existing validation errors
            const hasErrors = Object.values(errors).some((error) => error !== '');
            if (hasErrors) {
                toast.error('Vui lòng sửa các lỗi trước khi lưu');
                return;
            }
        } catch (error: any) {
            const validationErrors = getValidationErrors(error);
            setErrors((prev) => ({ ...prev, ...validationErrors }));
            toast.error('Có lỗi trong thông tin đã nhập');
            return;
        }

        setIsLoading(true);

        const formDataToSend = new FormData();

        // Only send fields that have been modified and are valid
        if (formData.fullname && formData.fullname !== (userProfile.fullname || '')) {
            formDataToSend.append('fullname', formData.fullname);
        }

        if (formData.gender && formData.gender !== (userProfile.gender || '')) {
            formDataToSend.append('gender', formData.gender);
        }

        if (formData.email && formData.email !== (userProfile.email || '')) {
            formDataToSend.append('email', formData.email);
        }

        // Only send phone number if it's valid and changed
        if (formData.phonenumber && formData.phonenumber !== (userProfile.phonenumber || '') && !errors.phonenumber) {
            formDataToSend.append('phonenumber', formData.phonenumber);
        }

        // Address is required by API, so always send it
        formDataToSend.append('address', formData.address || userProfile.address || '');

        // Add dob if it exists and has changed
        if (formData.dob) {
            const currentDob = formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '';
            const originalDob = userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : '';
            if (currentDob !== originalDob) {
                const dobDate = new Date(formData.dob);
                formDataToSend.append('dob', dobDate.toISOString());
            }
        }

        if (formData.avatar) {
            formDataToSend.append('avatarurl', formData.avatar);
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
        } catch (error) {
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
                                    min={
                                        new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    max={
                                        new Date(new Date().setFullYear(new Date().getFullYear() - 16))
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    className={`w-full rounded border px-3 py-1 ${
                                        errors.dob ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.dob && <span className="mt-1 text-xs text-red-500">{errors.dob}</span>}
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
