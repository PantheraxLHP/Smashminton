import { redirect } from 'next/navigation';

interface BookingStepProps {
    currentStep: number;
    disableNavigation?: boolean;
}

const BookingStep: React.FC<BookingStepProps> = ({ currentStep, disableNavigation = false }) => {
    const steps = [
        { id: 1, title: 'Đặt sân', link: '/booking/courts' },
        { id: 2, title: 'Sản phẩm', link: '/booking/products' },
        { id: 3, title: 'Dịch vụ', link: '/booking/rentals' },
        { id: 4, title: 'Thanh toán', link: '/booking/payment' },
    ];

    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-x-10 py-4 sm:gap-x-16 lg:gap-x-20">
            {steps.map((step, index) => (
                <div
                    key={step.id}
                    className="flex flex-col items-center"
                    onClick={() => {
                        if (!disableNavigation && step.id <= currentStep) {
                            redirect(step.link);
                        }
                    }}
                >
                    {/* Step Circle và Step Line */}
                    <div
                        className={`relative flex items-center ${!disableNavigation && step.id <= currentStep ? 'cursor-pointer' : ''}`}
                    >
                        {/* Step Circle */}
                        <div
                            className={`flex items-center justify-center rounded-full font-semibold text-white ${currentStep >= step.id ? 'bg-primary-500' : 'bg-gray-400'} h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${!disableNavigation && step.id <= currentStep ? 'hover:brightness-90' : ''}`}
                        >
                            {step.id}
                        </div>

                        {/* Step Line (Không render sau bước cuối) */}
                        {index < steps.length - 1 && (
                            <div
                                className={`tranlate-y-[-50%] absolute left-[98%] z-[-1] h-2 bg-gray-300 ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'} w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]`}
                            ></div>
                        )}
                    </div>

                    {/* Step Label */}
                    <div
                        className={`mt-2 text-center text-xs sm:text-sm lg:text-base ${!disableNavigation && step.id <= currentStep ? 'hover:text-primary-500 cursor-pointer' : ''}`}
                    >
                        {step.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingStep;
