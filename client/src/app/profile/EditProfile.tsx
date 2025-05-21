// components/EditProfile.tsx
'use client';

import { Accounts } from '@/types/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaTimes, FaPen, FaUser, FaVenusMars, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

interface EditProfileProps {
    userProfile: Accounts;
    onClose: () => void;
    onSave: (updatedUser: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ userProfile, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        avatar: null as File | null,
        name: userProfile.fullname,
        gender: userProfile.gender,
        phone: userProfile.phonenumber,
        address: userProfile.address,
        email: userProfile.email,
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, avatar: file }));
    };

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu và nhập lại mật khẩu không khớp');
            return;
        }
        onSave(formData);
        onClose();
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
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <div className="relative mb-2 h-24 w-24">
                                    {formData.avatar || userProfile.avatarurl ? (
                                        <Image
                                            src={
                                                formData.avatar
                                                    ? URL.createObjectURL(formData.avatar)
                                                    : userProfile.avatarurl!
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

                            {/* Tên */}
                            <div>
                                <label className="block flex items-center gap-2 text-sm font-medium">
                                    <FaUser className="text-primary-600" /> Tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-1"
                                />
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block flex items-center gap-2 text-sm font-medium">
                                    <FaVenusMars className="text-primary-600" /> Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-1"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            {/* SĐT */}
                            <div>
                                <label className="block flex items-center gap-2 text-sm font-medium">
                                    <FaPhone className="text-primary-600" /> Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-1"
                                />
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block flex items-center gap-2 text-sm font-medium">
                                    <FaMapMarkerAlt className="text-primary-600" /> Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-1"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block flex items-center gap-2 text-sm font-medium">
                                    <FaEnvelope className="text-primary-600" /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="mt-6 flex justify-end gap-2 pr-4">
                        <button onClick={onClose} className="rounded border px-4 py-2 text-gray-600 hover:bg-gray-100">
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-primary-600 hover:bg-primary-700 rounded px-4 py-2 text-white"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
