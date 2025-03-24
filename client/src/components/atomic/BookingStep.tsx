import { FC } from "react";

interface BookingStepProps {
    currentStep: number;
}

const BookingStep: FC<BookingStepProps> = ({ currentStep }) => {
    const steps = [
        { id: 1, title: "Đặt sân" },
        { id: 2, title: "Sản phẩm / Dịch vụ" },
        { id: 3, title: "Thanh toán" },
    ];

    return (
        <div className="flex items-center justify-center w-full py-4 gap-x-10 sm:gap-x-16 lg:gap-x-20 flex-wrap">
            {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                    {/* Step Circle và Step Line */}
                    <div className="relative flex items-center">
                        {/* Step Circle */}
                        <div
                            className={`flex items-center justify-center rounded-full text-white font-semibold 
                                ${currentStep >= step.id ? "bg-green-500" : "bg-gray-400"}
                                w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
                            `}
                        >
                            {step.id}
                        </div>

                        {/* Step Line (Không render sau bước cuối) */}
                        {index < steps.length - 1 && (
                            <div
                                className={`absolute left-[98%] tranlate-y-[-50%] z-[-1]
                                    h-2 bg-gray-300
                                    ${currentStep > step.id ? "bg-green-500" : "bg-gray-300"}
                                    w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]
                                `}
                            ></div>
                        )}
                    </div>

                    {/* Step Label */}
                    <div className="text-center text-xs sm:text-sm lg:text-base mt-2">
                        {step.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingStep;
