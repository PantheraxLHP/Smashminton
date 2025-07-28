'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeatureZone, getZones } from '@/services/zones.service';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const durations = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
const times = [
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
];

const FastBooking = () => {
    const [zone, setZone] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [startTime, setStartTime] = useState('');
    const router = useRouter();
    const [zones, setZones] = useState<FeatureZone[]>([]);
    useEffect(() => {
        const fetchZones = async () => {
            const response = await getZones();
            if (response.ok) {
                setZones(response.data.zones);
            }
        };
        fetchZones();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (zone) params.append('zone', zone);
        if (date) params.append('date', date);
        if (duration) params.append('duration', duration);
        if (startTime) params.append('startTime', startTime);
        router.push(`/booking/courts?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-lg flex-[1_1_33%] rounded-xl bg-black/20 p-4">
            <p className="flex w-full justify-center pb-5 text-center text-base font-light text-white transition-all lg:text-lg">
                Khám phá và đặt sân cầu lông chất lượng cao
                <br />
                Một cách dễ dàng với Smashminton
            </p>
            <div className="w-full max-w-md flex-1/3 rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <h2 className="text-xl font-semibold text-gray-800">Đặt sân cầu lông chất lượng cao</h2>
                <p className="text-sm text-gray-600">Tìm và đặt sân phù hợp với nhu cầu của bạn</p>

                <form onSubmit={handleSubmit}>
                    <div className="mt-5 space-y-4">
                        {/* Khu vực sân */}
                        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <Select value={zone} onValueChange={setZone}>
                                <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                                    <SelectValue placeholder="Chọn khu vực sân" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map((z) => (
                                        <SelectItem key={z.zoneid} value={z.zoneid.toString()}>
                                            {z.zonename}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ngày */}
                        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <Input
                                type="date"
                                className="border-0 bg-transparent focus:ring-0"
                                min={new Date().toISOString().split('T')[0]}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Thời lượng và giờ bắt đầu */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                                <Clock className="h-5 w-5 text-gray-500" />
                                <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                                        <SelectValue placeholder="Thời lượng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {durations.map((d) => (
                                            <SelectItem key={d} value={d}>
                                                {d} giờ
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
                                <Clock className="h-5 w-5 text-gray-500" />
                                <Select value={startTime} onValueChange={setStartTime}>
                                    <SelectTrigger className="max-h-[200px] border-0 bg-transparent focus:ring-0">
                                        <SelectValue placeholder="Giờ bắt đầu" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {times.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button size="lg" className="w-full" type="submit">
                            TÌM SÂN TRỐNG
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FastBooking;
