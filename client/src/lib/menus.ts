export const menus = {
    guest: [
        { label: 'Đặt sân', link: '/booking' },
        { label: 'Sản phẩm', link: '/products' },
        { label: 'Dịch vụ', link: '/rentals' },
    ],
    customer: [
        { label: 'Đặt sân', link: '/booking' },
        { label: 'Sản phẩm', link: '/products' },
        { label: 'Dịch vụ', link: '/rentals' },
    ],
    employee: [
        { label: 'Đặt sân', link: '/booking' },
        { label: 'Chi tiết đặt sân', link: '/booking-detail' },
    ],
    hr_manager: [
        {
            label: 'Đăng ký ca làm',
            link: '/assignments',
        },
        {
            label: 'Quản lý nhân viên',
            link: '/employees',
        },
        { label: 'Danh sách ghi chú', link: '/approvals' },
    ],
    wh_manager: [
        {
            label: 'Giá thuê sân, dịch vụ',
            link: '/price-management',
            subMenu: [
                { label: 'Quản lý giá sân', link: '/price-management/court-price' },
                { label: 'Quản lý giá dịch vụ', link: '/price-management/rental-price' },
            ],
        },
        {
            label: 'Kho hàng',
            link: '/warehouse',
            subMenu: [
                { label: 'Khu vực/Sân', link: '/warehouse/zone-court' },
                { label: 'Hàng hoá', link: '/warehouse/accessories' },
                { label: 'Nhà cung cấp', link: '/warehouse/suppliers' },
                { label: 'Đơn đặt hàng', link: '/warehouse/orders' },
            ],
        },
    ],
    admin: [
        { label: 'Thống kê kinh doanh', link: '/admin/dashboard' },
        { label: 'Hỗ trợ dự đoán', link: '/admin/prediction' },
    ],
};
