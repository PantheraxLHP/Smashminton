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

export const getZones = async () => {
    try {
        // Get ApiResponse from /api/zones

        const res = await fetch('/api/zones');
        const result = await res.json();

        if (!res.ok) {
            return ServiceResponse.error(result.message);
        }

        const featuredZones = result.data.zones.map((zone: Zones) => ({
            ...zone,
            feature: featureTranslations[zone.zonetype || ''] || 'Không có thông tin',
        }));
        // Return a ServiceResponse object with the 'zones' as featuredZones in the 'data' property
        return ServiceResponse.success({ zones: featuredZones });
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
};
