import { Button } from '@/components/ui/button';
import Link from 'next/link';
import FastBooking from './fast-booking';

const HeroSection = () => {
    return (
        <div className="max-h-[80vh] bg-[url('https://res.cloudinary.com/dnagyxwcl/image/upload/v1746248985/What_is_the_Weight_of_a_Plastic_Shuttlecock__-_BadmintonBites_cwgpxi.jpg')] bg-cover bg-center p-8">
            <div className="relative max-h-screen w-full">
                <div className="container mx-auto flex h-full flex-col items-center justify-between px-4 py-16 md:px-6 lg:flex-row lg:px-8 gap-8">
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
        </div>
    );
};

export default HeroSection;
