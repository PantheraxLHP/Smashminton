import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface Props {
    position: { x: number; y: number };
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function MoreActionsMenu({ position, onClose, onEdit, onDelete }: Props) {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            onClose();
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

    const menu = (
        <div
            className="absolute z-1 w-24 bg-white border rounded shadow"
            style={{ top: position.y, left: position.x }}
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="text-sm">
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        onEdit();
                        onClose();
                    }}
                >
                    Sửa
                </li>
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                >
                    Xoá
                </li>
                {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Đặt hàng</li> */}
            </ul>
        </div>
    );

    return ReactDOM.createPortal(menu, document.body);
}
