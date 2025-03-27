import BlueLine from '@/components/atomic/BlueLine';
import { Button } from '@/components/ui/button';
import { FeatureZone } from '../api/zones/route';
import Image from 'next/image';
import Link from 'next/link';

async function getZones(): Promise<FeatureZone[]> {
    const response = await fetch(`${process.env.HOST}/api/zones`, {
        cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch zones');

    return response.json();
}

const FeaturedCourts = async () => {
    const zones = await getZones();

    return (
        <div className="container mx-auto bg-white px-4 py-16">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Sân cầu lông nổi bật</h3>
                <p className="mx-auto mt-3 max-w-2xl pb-5 text-gray-600">
                    Khám phá các sân cầu lông chất lượng cao, đáp ứng mọi nhu cầu tập luyện và thi đấu của bạn.
                </p>
            </div>
            <BlueLine />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {zones.map((zone) => (
                    <div
                        key={zone.zoneid}
                        className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <Image
                                src={zone.zoneimgurl || ''}
                                alt={zone.zonename || ''}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="text-primary-600 absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                                ⭐ {'4.5'}
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="text-xl font-semibold text-gray-800"> {zone.zonename}</h4>
                            <p className="mt-1 text-gray-600">Mở cửa 6:00 - 22:00</p>

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-lg font-bold"> {zone.feature} </p>
                                <Button variant="outline" asChild>
                                    <Link href={'booking'}> Đặt ngay</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 pb-5 text-center">
                <Button variant="default" asChild>
                    <Link href={'booking'}>Xem tất cả sân →</Link>
                </Button>
            </div>
            <BlueLine />
        </div>
    );
};

export default FeaturedCourts;
