import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface Props {
    position: { x: number; y: number };
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    showOptions?: boolean;
    onOrder?: () => void;
}

export default function MoreActionsMenu({ position, onClose, onEdit, onDelete, showOptions, onOrder }: Props) {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            onClose();
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

    const menu = (
        <div
            className="absolute z-1 w-20 bg-white border rounded shadow"
            style={{ top: position.y, left: position.x }}
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="text-sm">
                <li
                    className="px-2 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        onEdit();
                        onClose();
                    }}
                >
                    Sửa
                </li>
                <li
                    className="px-2 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                >
                    Xoá
                </li>
                {showOptions && (<li className="px-2 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        onClose();
                        onOrder?.();
                    }}  
                >
                    Đặt hàng</li>)}
            </ul>
        </div>
    );

    return ReactDOM.createPortal(menu, document.body);
}
