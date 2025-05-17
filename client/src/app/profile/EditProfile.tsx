// components/EditProfile.tsx
'use client';

import React, { useState } from 'react';
import { FaTimes, FaPen, FaUser, FaVenusMars, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

interface EditProfileProps {
    user: {
        name: string;
        gender: string;
        phone: string;
        address: string;
        email: string;
        avatarUrl?: string; // đường dẫn ảnh hiện tại (nếu có)
    };
    onClose: () => void;
    onSave: (updatedUser: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        avatar: null as File | null,
        name: user.name,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        email: user.email,
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, avatar: file }));
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
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl w-[95%] sm:w-[90%] md:w-full max-w-md max-h-[80vh] relative flex flex-col pb-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end p-2">
                    <button
                        className="text-gray-600 hover:text-red-500 z-10"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[80vh] mr-2">
                    <div className="p-2 md:p-4">
                        <h2 className="text-xl font-semibold mb-6 text-center text-primary-600">CẬP NHẬT THÔNG TIN CÁ NHÂN</h2>
                        <div className="space-y-4">
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 mb-2">
                                    {formData.avatar || user.avatarUrl ? (
                                        <img
                                            src={
                                                formData.avatar
                                                    ? URL.createObjectURL(formData.avatar)
                                                    : user.avatarUrl!
                                            }
                                            alt="Avatar"
                                            className="w-24 h-24 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border">
                                            <FaUser className="text-gray-500 text-3xl" />
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload">
                                        <div className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full cursor-pointer hover:bg-gray-300 border border-gray-500">
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
                                <label className="block font-medium text-sm flex items-center gap-2">
                                    <FaUser className="text-primary-600" /> Tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                />
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block font-medium text-sm flex items-center gap-2">
                                    <FaVenusMars className="text-primary-600" /> Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            {/* SĐT */}
                            <div>
                                <label className="block font-medium text-sm flex items-center gap-2">
                                    <FaPhone className="text-primary-600" /> Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                />
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block font-medium text-sm flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary-600" /> Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium text-sm flex items-center gap-2">
                                    <FaEnvelope className="text-primary-600" /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                />
                            </div>

                            {/* Ghi chú mật khẩu */}
                            <p className="text-sm text-gray-500 text-center mt-4 mb-2">
                                Để trống nếu không muốn thay đổi mật khẩu
                            </p>

                            {/* Mật khẩu */}
                            <div>
                                <label className="block font-medium text-sm">Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                />
                            </div>

                            {/* Nhập lại mật khẩu */}
                            <div>
                                <label className="block font-medium text-sm">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="mt-6 flex justify-end gap-2 pr-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
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
