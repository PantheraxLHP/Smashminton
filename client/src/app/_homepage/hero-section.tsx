import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FastBooking from './fast-booking';

const HeroSection = () => {
    return (
        <div className="relative h-screen w-full">
            <Image
                src="/homebg.png"
                alt="Badminton Court"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="absolute inset-0 -z-10 object-cover brightness-[0.85]"
            />
            <div className="container mx-auto flex h-full flex-col items-center justify-between px-4 py-16 md:px-6 lg:flex-row lg:px-8">
                {/* Left Section: Text */}
                <div className="max-w-xl text-center text-white lg:text-left">
                    <h1 className="text-3xl leading-tight font-bold uppercase drop-shadow-lg md:text-4xl lg:text-5xl">
                        Thể thao mỗi ngày, sức khỏe mỗi phút
                    </h1>
                    <p className="mt-3 text-lg italic drop-shadow-lg md:text-2xl">Đặt sân cầu lông ngay hôm nay!</p>
                    <Button variant="outline" className="mt-4">
                        Đặt lịch cố định →
                    </Button>
                </div>

                {/* Right Section: Form */}
                <div className="max-w-md">
                    <FastBooking />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
