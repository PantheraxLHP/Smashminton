import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FastBooking from './fast-booking';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <div className="relative max-h-screen w-full">
            <Image
                src="/homepg.png"
                alt="Badminton Court"
                fill
                priority
                quality={100}
                className="absolute inset-0 -z-10 object-cover"
            />
            <div className="container mx-auto flex h-full flex-col items-center justify-between px-4 py-16 md:px-6 lg:flex-row lg:px-8">
                {/* Left Section: Text */}
                <div className="max-w-xl text-center text-white lg:text-left">
                    <h1 className="text-3xl leading-tight font-bold uppercase drop-shadow-lg md:text-4xl lg:text-5xl">
                        Thể thao mỗi ngày, sức khỏe mỗi phút
                    </h1>
                    <p className="mt-3 text-lg italic drop-shadow-lg md:text-2xl">Đặt sân cầu lông ngay hôm nay!</p>
                    <Button
                        variant="default"
                        className="bg-primary hover:bg-primary/60 mt-6 transform rounded-lg px-6 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
                        asChild
                    >
                        <Link href={'booking/courts'}>ĐẶT SÂN NGAY !!!</Link>
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
