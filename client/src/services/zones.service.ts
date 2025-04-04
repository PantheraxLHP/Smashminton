import { Zones } from '@/types/types';

export interface FeatureZone extends Zones {
    feature: string;
}

const featureTranslations: Record<string, string> = {
    Normal: 'Thông thoáng, không gian rộng, giá hợp lý',
    AirConditioner: 'Máy lạnh hiện đại, sân cao cấp, dịch vụ VIP',
    Private: 'Không gian riêng tư, ánh sáng tốt, phù hợp thi đấu',
};

export const getZones = async (): Promise<FeatureZone[]> => {
    const response = await fetch(`${process.env.SERVER}/api/v1/zones`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data: Zones[] = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid response format');
    return data.map((zone) => ({
        ...zone,
        feature: featureTranslations[zone.zonetype || ''] || 'Không có thông tin',
    }));
};
