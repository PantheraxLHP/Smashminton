import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, MapPinned } from 'lucide-react';

const FastBooking = () => {
    return (
        <div className="w-full max-w-md flex-[1_1_33%] rounded-xl bg-black/20 p-5">
            <p className="flex w-full justify-center pb-5 text-center text-base font-light text-white transition-all lg:text-lg">
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

                    <Button size="lg" className="w-full">
                        TÌM SÂN TRỐNG
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FastBooking;
