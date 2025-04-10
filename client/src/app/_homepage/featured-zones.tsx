import BlueLine from '@/components/atomic/BlueLine';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ZoneList from './ZoneList';

const FeaturedCourts = () => {
    return (
        <div className="container mx-auto bg-white px-4 py-16">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Sân cầu lông nổi bật</h3>
                <p className="mx-auto mt-3 max-w-2xl pb-5 text-gray-600">
                    Khám phá các sân cầu lông chất lượng cao, đáp ứng mọi nhu cầu tập luyện và thi đấu của bạn.
                </p>
            </div>
            <BlueLine />
            <ZoneList />
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
