// call by client component -> can use relative URL

import { ServiceResponse } from '@/lib/serviceResponse';
import { Zones } from '@/types/types';

export interface FeatureZone extends Zones {
    feature: string;
}
const featureTranslations: Record<string, string> = {
    Normal: 'Thông thoáng, không gian rộng, giá hợp lý',
    AirConditioner: 'Máy lạnh hiện đại, sân cao cấp, dịch vụ VIP',
    Private: 'Không gian riêng tư, ánh sáng tốt, phù hợp thi đấu',
};

// Remember to return data type for typescript to infer
export const getZones = async () => {
    try {
        const res = await fetch('/api/zones');

        if (!res.ok) {
            throw new Error('Failed to fetch zones');
        }

        const response = await res.json();
        const featuredZones = response.data.zones.map((zone: Zones) => ({
            ...zone,
            feature: featureTranslations[zone.zonetype || ''] || 'Không có thông tin',
        }));
        return ServiceResponse.success<{ zones: FeatureZone[] }>({ zones: featuredZones });
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
};
