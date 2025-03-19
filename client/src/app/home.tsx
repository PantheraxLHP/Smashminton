import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dumbbell,
  Footprints,
  ShoppingBag,
  GlassWater,
  Shirt,
  GripVertical,
  MapPin,
  Clock,
  Calendar,
  MapPinned,
} from 'lucide-react';

const Home = () => {
  return (
    <section className="relative w-full">
      {/* Hero Section - Responsive Improvements */}
      <div className="relative flex h-screen w-full items-center justify-center px-4 py-16 md:px-6 lg:px-8">
        <Image
          src="/homebg.png"
          alt="Badminton Court"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover brightness-[0.85]"
        />
        <div className="container mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-between">
          {/* Hero Text - Responsive for all devices */}
          <div className="max-w-md flex-2/3 text-white md:max-w-lg lg:self-center">
            <div className="text-3xl leading-tight font-bold whitespace-nowrap uppercase md:text-4xl lg:text-5xl drop-shadow-lg">
              Thể thao mỗi ngày, sức khỏe mỗi phút
            </div>
            <p className="mt-3 text-lg md:text-4xl drop-shadow-lg italic">Đặt sân cầu lông ngay hôm nay!</p>
            <Button className="mt-6 text-green-500 border-2 border-green-500 bg-white px-6 py-2 text-lg font-medium transition-all hover:bg-green-600 hover:text-white">
              Đặt lịch cố định →
            </Button>
          </div>

          {/* Booking Form - Better mobile experience */}
          <div className="w-full max-w-md flex-[1_1_33%] rounded-xl bg-black/20 p-5">
            <p className="w-full pb-5 text-base font-roboto font-light text-white transition-all text-center flex justify-center lg:text-lg">
              Khám phá và đặt sân cầu lông chất lượng cao
              <br />
              Một cách dễ dàng với Smashminton
            </p>
            <div className="w-full max-w-md flex-1/3 rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur-sm md:p-6">
              <h2 className="text-xl font-semibold text-gray-800">Đặt sân cầu lông chất lượng cao</h2>
              <p className="text-sm text-gray-600">Tìm và đặt sân phù hợp với nhu cầu của bạn</p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <Select>
                    <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                      <SelectValue placeholder="Chọn khu vực sân" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="khu1">Khu vực 1</SelectItem>
                      <SelectItem value="khu2">Khu vực 2</SelectItem>
                      <SelectItem value="khu3">Khu vực 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                  <MapPinned className="h-5 w-5 text-gray-500" />
                  <Select>
                    <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                      <SelectValue placeholder="Chọn loại sân" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typea">Loại A</SelectItem>
                      <SelectItem value="typeb">Loại B</SelectItem>
                      <SelectItem value="typec">Loại C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <Input type="date" className="border-0 bg-transparent focus:ring-0" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <Select>
                      <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                        <SelectValue placeholder="Giờ bắt đầu" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 6).map((hour) => (
                          <SelectItem
                            key={hour}
                            value={`${hour}h`}
                          >{`${hour.toString().padStart(2, '0')}:00`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <Select>
                      <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                        <SelectValue placeholder="Thời lượng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 giờ</SelectItem>
                        <SelectItem value="2h">2 giờ</SelectItem>
                        <SelectItem value="3h">3 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full bg-green-500 py-5 text-base font-medium text-white transition-all hover:bg-green-600 hover:shadow-md">
                  TÌM SÂN TRỐNG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courts Section - Improved cards */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Sân cầu lông nổi bật</h3>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Khám phá các sân cầu lông chất lượng cao, đáp ứng mọi nhu cầu tập luyện và thi đấu của bạn.
            </p>
          </div>

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
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-green-600 backdrop-blur-sm">
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
                        <span className="mr-2 text-green-500">✓</span> {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-green-600">
                      {court.price} VNĐ<span className="text-sm font-normal text-gray-500"> / giờ</span>
                    </p>
                    <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                      Đặt ngay
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              Xem tất cả sân →
            </Button>
          </div>
        </div>
      </div>

      {/* Product & Services Section - Improved layout */}
      <div className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Dịch vụ đi kèm</h3>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Cung cấp đầy đủ các dịch vụ giúp buổi chơi cầu lông của bạn trở nên trọn vẹn
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { title: 'Thuê vợt', icon: Dumbbell, desc: 'Vợt chất lượng cao từ nhiều thương hiệu' },
              { title: 'Thuê giày', icon: Footprints, desc: 'Giày thể thao chuyên dụng nhiều size' },
              { title: 'Túi đựng giày', icon: ShoppingBag, desc: 'Bảo vệ giày khi di chuyển' },
              { title: 'Đồ ăn & nước', icon: GlassWater, desc: 'Đồ uống và thực phẩm dinh dưỡng' },
              { title: 'Quả cầu', icon: Shirt, desc: 'Cầu lông đạt tiêu chuẩn thi đấu' },
              { title: 'Phụ kiện', icon: GripVertical, desc: 'Băng, grip và các phụ kiện khác' },
            ].map((item, index) => (
              <div
                key={index}
                className="group flex flex-col items-center rounded-xl border border-gray-200 p-5 transition-all hover:border-green-200 hover:bg-green-50 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 transition-colors group-hover:bg-green-200">
                  <item.icon className="h-8 w-8" />
                </div>
                <h4 className="text-center text-lg font-semibold text-gray-800">{item.title}</h4>
                <p className="mt-2 text-center text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
