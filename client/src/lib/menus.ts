export const menus = {
    guest: [
        { label: 'Đặt sân', link: '/booking' },
        { label: 'Sản phẩm', link: '/products' },
        { label: 'Dịch vụ', link: '/rentals' },
    ],
    customer: [
        { label: 'Sản phẩm', link: '/products' },
        { label: 'Dịch vụ', link: '/rentals' },
    ],
    employee: [
        { label: 'Hỗ trợ khách hàng', link: '/support' },
        { label: 'Quản lý công việc', link: '/work-management' },
    ],
    hr_manager: [
        {
            label: 'Quản lý nhân viên',
            link: '/staff-management',
            subMenu: [{ label: 'Danh sách', link: '/staff/list' }],
        },
        { label: 'Phân công công việc', link: '/tasks' },
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
                { label: 'Hàng hoá', link: '/warehouse/accessories' },
                { label: 'Nhà cung cấp', link: '/warehouse/supplier' },
                { label: 'Phiếu đặt hàng', link: '/warehouse/order' },
                { label: 'Nhập/Xuất hàng', link: '/warehouse/transaction' },
            ],
        },
    ],
    admin: [
        { label: 'Thống kê kinh doanh', link: '/business-stats' },
        { label: 'Hỗ trợ dự đoán', link: '/prediction-support' },
    ],
};
