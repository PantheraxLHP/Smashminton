import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';

interface BookingStepperProps {
    currentStep: number;
    disableNavigation?: boolean;
}

const steps = [
    { id: 1, title: 'Đặt sân', link: '/booking/courts' },
    { id: 2, title: 'Sản phẩm', link: '/booking/products' },
    { id: 3, title: 'Dịch vụ', link: '/booking/rentals' },
    { id: 4, title: 'Thanh toán', link: '/booking/payment' },
];

const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep, disableNavigation = false }) => {
    const { fetchBooking } = useBooking();

    const handleStepClick = (stepId: number, link: string) => {
        if (!disableNavigation && stepId <= currentStep) {
            fetchBooking();
            redirect(link);
        }
    };

    const handleBackButtonClick = () => {
        if (currentStep > 1) {
            fetchBooking();
            redirect(steps[currentStep - 2].link);
        }
    };

    const handleNextButtonClick = () => {
        if (currentStep < steps.length) {
            fetchBooking();
            redirect(steps[currentStep].link);
        }
    };

    return (
        <div className="relative flex w-full items-center justify-between">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0">
                <Button
                    variant={'secondary'}
                    size={'xs'}
                    onClick={handleBackButtonClick}
                    className={`h-6 w-16 p-0 text-[10px] sm:h-8 sm:w-auto sm:px-3 sm:text-xs ${currentStep === 1 ? 'hidden' : ''}`}                >
                    ← Quay lại
                </Button>
            </div>
            {/* Stepper */}
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 lg:gap-x-8">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex flex-col items-center"
                        onClick={() => handleStepClick(step.id, step.link)}
                    >
                        <div
                            className={`relative flex items-center ${!disableNavigation && step.id <= currentStep ? 'cursor-pointer' : ''}`}
                        >
                            {/* Step Circle */}
                            <div
                                className={`flex items-center justify-center rounded-full font-semibold text-white ${currentStep >= step.id ? 'bg-primary-500' : 'bg-gray-400'} h-7 w-7 text-xs sm:h-8 sm:w-8 sm:text-sm lg:h-9 lg:w-9 lg:text-base ${!disableNavigation && step.id <= currentStep ? 'hover:brightness-90' : ''}`}
                            >
                                {step.id}
                            </div>
                            {/* Step Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-[98%] z-[-1] h-1 translate-y-[-50%] bg-gray-300 ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'} w-[calc(100%+1rem)] sm:w-[calc(100%+1.5rem)] lg:w-[calc(100%+2rem)]`}
                                ></div>
                            )}
                        </div>
                        {/* Step Label */}
                        <div
                            className={`mt-1 text-center text-[10px] sm:text-xs lg:text-sm ${!disableNavigation && step.id <= currentStep ? 'hover:text-primary-500 cursor-pointer' : ''}`}
                        >
                            {step.title}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0">
                <Button
                    variant={'default'}
                    size={'xs'}
                    onClick={handleNextButtonClick}
                    className={`h-6 w-16 p-0 text-[10px] sm:h-8 sm:w-auto sm:px-3 sm:text-xs ${currentStep === steps.length ? 'hidden' : ''}`}
                >
                    Tiếp theo →
                </Button>
            </div>
        </div>
    );
};

export default BookingStepper;
