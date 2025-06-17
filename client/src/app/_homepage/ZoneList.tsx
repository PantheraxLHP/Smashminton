'use client';

import { Button } from '@/components/ui/button';
import { getZones } from '@/services/zones.service';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FeatureZone } from '@/services/zones.service';
import ZoneSkeleton from './ZoneSkeleton';
import { toast } from 'sonner';

export default function ZoneList() {
    const [zones, setZones] = useState<FeatureZone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const result = await getZones();
                if (result.ok) {
                    setZones(result.data.zones);
                } else {
                    toast.error(result.message);
                }
            } catch (err) {
                toast.error('Không thể tải danh sách sân. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchZones();
    }, []);

    if (isLoading || !zones.length) {
        return <ZoneSkeleton />;
    }

    return (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
                <div
                    key={zone.zoneid}
                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
                >
                    <div className="relative h-56 overflow-hidden">
                        <Image
                            src={zone.zoneimgurl || '/default.png'}
                            alt={zone.zonename || 'Sân cầu lông'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-court.jpg';
                            }}
                        />
                        <div className="text-primary-600 absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                            ⭐ {'4.5'}
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="text-xl font-semibold text-gray-800">{zone.zonename}</h4>
                        <p className="mt-1 text-gray-600">Mở cửa 6:00 - 22:00</p>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-lg font-bold">{zone.feature}</p>
                            <Button variant="outline" asChild>
                                <Link href={'booking'}>Đặt ngay</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
