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
        { label: 'Giá thuê sân, dịch vụ', link: '/price-management' },
        { label: 'Kho hàng', link: '/warehouse' },
    ],
    admin: [
        { label: 'Thống kê kinh doanh', link: '/business-stats' },
        { label: 'Hỗ trợ dự đoán', link: '/prediction-support' },
    ],
};
