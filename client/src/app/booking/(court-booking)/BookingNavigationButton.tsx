import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface BookingNavigationButtonProps {
    currentStep: number;
}

const BookingNavigationButton: React.FC<BookingNavigationButtonProps> = ({ currentStep }) => {
    const router = useRouter();
    const steps = [
        { id: 1, title: 'Đặt sân', link: '/booking/courts' },
        { id: 2, title: 'Sản phẩm', link: '/booking/products' },
        { id: 3, title: 'Dịch vụ', link: '/booking/rentals' },
        { id: 4, title: 'Thanh toán', link: 'booking/payment' },
    ];

    const handleBackButtonClick = () => {
        if (currentStep > 1) {
            router.push(steps[currentStep - 2].link);
        }
    }

    const handleNextButtonClick = () => {
        if (currentStep < steps.length) {
            router.push(steps[currentStep].link);
        }
    }

    return (
        <div className="mt-4 flex justify-between">
            <Button
                onClick={handleBackButtonClick}
                variant={'secondary'}
                className={`${currentStep === 1 ? 'pointer-events-none opacity-0' : ''}`}
            >
                ← Quay lại
            </Button>

            <Button
                onClick={handleNextButtonClick}
                className={`bg-primary-500 text-white ${currentStep === 4 ? 'pointer-events-none opacity-0' : ''}`}
            >
                Tiếp theo →
            </Button>
        </div>
    );
}

export default BookingNavigationButton;