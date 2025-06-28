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
        {
            label: 'Lịch làm việc',
            link: '/assignments',
            subMenu: [
                { label: 'Đăng ký ca làm', link: '/enrollments' },
                { label: 'Xem phân công', link: '/assignments' },
            ],
        },
    ],
    hr_manager: [
        {
            label: 'Phân công công việc',
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
            label: 'Phân công công việc',
            link: '/assignments',
        },
        {
            label: 'Quản lý giá sân',
            link: '/price-management/court-price',
        },
        {
            label: 'Kho hàng',
            link: '/warehouse',
            subMenu: [
                { label: 'Khu vực/Sân', link: '/warehouse/zone-court' },
                { label: 'Đồ ăn thức uống', link: '/warehouse/food' },
                { label: 'Phụ kiện cầu lông', link: '/warehouse/accessories' },
                { label: 'Giày, vợt cho thuê', link: '/warehouse/rental' },
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
