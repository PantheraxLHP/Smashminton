import BlueLine from '@/components/atomic/BlueLine';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const FeaturedCourts = () => {
    return (
        <div className="">
            <div className="container mx-auto bg-white px-4 py-16">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Sân cầu lông nổi bật</h3>
                    <p className="mx-auto mt-3 max-w-2xl pb-5 text-gray-600">
                        Khám phá các sân cầu lông chất lượng cao, đáp ứng mọi nhu cầu tập luyện và thi đấu của bạn.
                    </p>
                </div>
                <BlueLine />
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            id: 'A',
                            name: 'Sân riêng biệt',
                            price: '90.000',
                            rating: 4.5,
                            img: '/ZoneA.png',
                            features: ['Không gian riêng tư', 'Ánh sáng tốt', 'Phù hợp thi đấu'],
                        },
                        {
                            id: 'B',
                            name: 'Sân máy lạnh',
                            price: '150.000',
                            rating: 4.8,
                            img: '/ZoneB.png',
                            features: ['Máy lạnh hiện đại', 'Sân cao cấp', 'Dịch vụ VIP'],
                        },
                        {
                            id: 'C',
                            name: 'Sân thoáng mát',
                            price: '105.000',
                            rating: 4.3,
                            img: '/ZoneC.png',
                            features: ['Thông thoáng', 'Không gian rộng', 'Giá hợp lý'],
                        },
                    ].map((court) => (
                        <div
                            key={court.id}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={court.img}
                                    alt={court.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="text-primary-600 absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                                    ⭐ {court.rating}
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-semibold text-gray-800">
                                    Zone {court.id} - {court.name}
                                </h4>
                                <p className="mt-1 text-gray-600">Mở cửa 6:00 - 22:00</p>

                                <ul className="mt-3 space-y-1">
                                    {court.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-600">
                                            <span className="text-primary-500 mr-2">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-primary-600 text-lg font-bold">
                                        {court.price} VNĐ
                                        <span className="text-sm font-normal text-gray-500"> / giờ</span>
                                    </p>
                                    <Button variant="outline">Đặt ngay</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pb-5 text-center">
                    <Button variant="default">Xem tất cả sân →</Button>
                </div>
                <BlueLine />
            </div>
        </div>
    );
};

export default FeaturedCourts;
