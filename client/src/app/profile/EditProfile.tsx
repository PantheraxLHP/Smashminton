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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: { target: HTMLInputElement }) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, avatar: file }));
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsLoading(true);
        e.preventDefault();
        if (!userProfile?.accountid) return;

        const formDataToSend = new FormData();

        // Add all form fields to FormData
        if (formData.fullname) formDataToSend.append('fullname', formData.fullname);
        if (formData.gender) formDataToSend.append('gender', formData.gender);
        if (formData.email) formDataToSend.append('email', formData.email);
        if (formData.phonenumber) formDataToSend.append('phonenumber', formData.phonenumber);
        if (formData.address) formDataToSend.append('address', formData.address);
        // Add dob if it exists, ensuring it's in ISO format
        if (formData.dob) {
            const dobDate = new Date(formData.dob);
            formDataToSend.append('dob', dobDate.toISOString());
        }

        // Add avatar if it exists - make sure to use the correct field name 'avatarurl'
        if (formData.avatar) {
            formDataToSend.append('avatarurl', formData.avatar);
        }

        const response = await updateProfile(userProfile.accountid, formDataToSend);
        if (response.ok) {
            // Preserve the JWT fields when updating
            onSave({
                ...response.data,
                role: userProfile.role,
            });
            onClose();
            toast.success('Cập nhật thông tin thành công');
            window.location.reload();
        } else {
            toast.error('Cập nhật thông tin thất bại');
            window.location.reload();
        }
        setIsLoading(false);
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
                                    className="w-full rounded border px-3 py-1"
                                />
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
                                    className="w-full rounded border px-3 py-1"
                                />
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
                                    className="w-full rounded border px-3 py-1"
                                />
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
                                    className="w-full rounded border px-3 py-1"
                                />
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
                                    className="w-full rounded border px-3 py-1"
                                />
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
                            disabled={isLoading}
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
