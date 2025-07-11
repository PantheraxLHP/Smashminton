import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
    position: { x: number; y: number };
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    showOptions?: boolean;
    onOrder?: () => void;
    showDelete?: boolean;
}

export default function MoreActionsMenu({ position, onClose, onEdit, onDelete, showOptions, onOrder, showDelete }: Props) {
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
                {showDelete && (
                    <ConfirmDialog
                        title="Xoá sản phẩm"
                        description="Bạn có chắc muốn xoá sản phẩm này không?"
                        onConfirm={() => {
                            onDelete();
                            onClose();
                        }}
                        trigger={
                            <li className="px-2 py-2 hover:bg-gray-100 cursor-pointer">
                                Xoá
                            </li>
                        }
                    />
                )}

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
