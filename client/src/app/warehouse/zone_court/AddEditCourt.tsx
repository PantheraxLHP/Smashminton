// 'use client';

// import React, { useRef, useEffect, useState } from "react";
// import { Service } from "../type";
// import { ChevronDownIcon } from "@heroicons/react/20/solid"; 

// interface ServiceModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSubmit?: (data: Service) => void;
//     editData?: Service | null;
// }

// function normalizeTimeString(time: string) {
//     const [hour, minute] = time.split(":").map(Number);
//     const pad = (n: number) => String(n).padStart(2, "0");
//     return `${pad(hour)}:${pad(minute)}`;
// }

// function formatPrice(price: string): string {
//     const number = Number(price.replace(/\D/g, ""));
//     return new Intl.NumberFormat("vi-VN").format(number) + " VND";
// }

// function generateTimeOptions(startHour: number, endHour: number) {
//     const times: string[] = [];
//     for (let hour = startHour; hour <= endHour; hour++) {
//         times.push(`${String(hour).padStart(2, "0")}:00`);
//         if (hour !== endHour) {
//             times.push(`${String(hour).padStart(2, "0")}:30`);
//         }
//     }
//     return times;
// }

// export default function ServiceModal({
//     open,
//     onClose,
//     onSubmit,
//     editData,
// }: ServiceModalProps) {
//     const modalRef = useRef<HTMLDivElement>(null);
//     const startTimeRef = useRef<HTMLDivElement>(null);
//     const endTimeRef = useRef<HTMLDivElement>(null);

//     const [formData, setFormData] = useState<Service>({
//         name: "",
//         price: "",
//         type: "",
//         product: "",
//         startTime: "06:00",
//         endTime: "21:30",
//         image: "",
//         startDay: "",
//         endDay: "",
//     });

//     const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
//     const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);

//     useEffect(() => {
//         if (editData) {
//             setFormData({
//                 ...editData,
//                 price: editData.price.replace(/[^\d]/g, ""),
//                 startTime: normalizeTimeString(editData.startTime),
//                 endTime: normalizeTimeString(editData.endTime),
//                 image: editData.image || "",
//             });
//         } else {
//             setFormData({
//                 name: "",
//                 price: "",
//                 type: "",
//                 product: "",
//                 startTime: "06:00",
//                 endTime: "21:30",
//                 image: "",
//                 startDay: "", 
//                 endDay: "",
//             });
//         }
//     }, [editData, open]);

//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             const target = event.target as Node;
//             // Kiểm tra nếu click ngoài modal
//             if (
//                 modalRef.current && !modalRef.current.contains(target)
//             ) {
//                 onClose();
//             }

//             // Kiểm tra nếu click ngoài dropdown startTime
//             if (
//                 startTimeRef.current && !startTimeRef.current.contains(target)
//             ) {
//                 setShowStartTimeDropdown(false);
//             }

//             // Kiểm tra nếu click ngoài dropdown endTime
//             if (
//                 endTimeRef.current && !endTimeRef.current.contains(target)
//             ) {
//                 setShowEndTimeDropdown(false);
//             }
//         }

//         if (open) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [open]);

//     function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     }

//     function handleSubmit() {
//         if (onSubmit) {
//             onSubmit({
//                 ...formData,
//                 price: formatPrice(formData.price),
//                 startTime: normalizeTimeString(formData.startTime),
//                 endTime: normalizeTimeString(formData.endTime),
//                 image: formData.image || "",
//             });
//         }
//         onClose();
//     }

//     const startTimes = generateTimeOptions(6, 22);
//     const endTimes = generateTimeOptions(6, 23);

//     function handleSelectTime(type: "startTime" | "endTime", time: string) {
//         setFormData((prev) => ({ ...prev, [type]: time }));
//         if (type === "startTime") setShowStartTimeDropdown(false);
//         else setShowEndTimeDropdown(false);
//     }

//     if (!open) return null;

//     return (
//         <>
//             <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"></div>

//             <div className="fixed inset-0 flex justify-center items-center z-50">
//                 <div
//                     ref={modalRef}
//                     className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
//                 >
//                     <h2 className="text-lg font-semibold mb-4">
//                         {editData ? "Sửa sân" : "Thêm sân"}
//                     </h2>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                         <div>
//                             <label className="block text-sm mb-1">Khu vực áp dụng</label>
//                             <div className="relative">
//                                 <select
//                                     name="product"
//                                     value={formData.product}
//                                     onChange={handleChange}
//                                     className={`w-full border rounded px-3 py-2 ${editData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                                     disabled={!!editData}
//                                 >
//                                     <option value="">Chọn khu vực</option>
//                                     <option value="Zone A">Zone A</option>
//                                     <option value="Zone B">Zone B</option>
//                                     <option value="Atlas">Zone C</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div>
//                             <label className="block text-sm mb-1">Giá thuê theo giờ</label>
//                             <input
//                                 name="price"
//                                 type="text"
//                                 value={formData.price}
//                                 onChange={handleChange}
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                         </div>

//                         {/* Start Time Dropdown */}
//                         <div className="relative" ref={startTimeRef}>
//                             <label className="block text-sm mb-1">Giờ bắt đầu</label>
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     if (!editData) {
//                                         setShowStartTimeDropdown(!showStartTimeDropdown);
//                                         setShowEndTimeDropdown(false);
//                                     }
//                                 }}
//                                 className="w-full border rounded px-3 py-2 text-left flex justify-between items-center"
//                                 disabled={!!editData}
//                             >
//                                 {formData.startTime}
//                                 <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
//                             </button>
//                             {showStartTimeDropdown && (
//                                 <div className="absolute z-50 bg-white border rounded mt-1 p-2 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto shadow">
//                                     {startTimes.map((time) => (
//                                         <button
//                                             key={time}
//                                             type="button"
//                                             onClick={() => handleSelectTime("startTime", time)}
//                                             className={`px-2 py-1 rounded text-sm border 
//                         ${formData.startTime === time ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'}`}
//                                         >
//                                             {time}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* End Time Dropdown */}
//                         <div className="relative" ref={endTimeRef}>
//                             <label className="block text-sm mb-1">Giờ kết thúc</label>
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     if (!editData) {
//                                         setShowEndTimeDropdown(!showEndTimeDropdown);
//                                         setShowStartTimeDropdown(false);
//                                     }
//                                 }}
//                                 className="w-full border rounded px-3 py-2 text-left flex justify-between items-center"
//                                 disabled={!!editData}
//                             >
//                                 {formData.endTime}
//                                 <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
//                             </button>
//                             {showEndTimeDropdown && (
//                                 <div className="absolute z-50 bg-white border rounded mt-1 p-2 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto shadow">
//                                     {endTimes.map((time) => (
//                                         <button
//                                             key={time}
//                                             type="button"
//                                             onClick={() => handleSelectTime("endTime", time)}
//                                             className={`px-2 py-1 rounded text-sm border 
//                         ${formData.endTime === time ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'}`}
//                                         >
//                                             {time}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="flex justify-end gap-2">
//                         <button
//                             onClick={onClose}
//                             className="border border-gray-400 text-black px-4 py-2 rounded hover:bg-gray-100"
//                         >
//                             Thoát
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-100"
//                         >
//                             {editData ? "Lưu thay đổi" : "Tạo"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
