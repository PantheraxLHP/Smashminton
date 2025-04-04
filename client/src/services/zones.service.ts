import { Zones } from '@/types/types';
import { NextResponse } from 'next/server';

export interface FeatureZone extends Zones {
    feature: string;
}

const featureTranslations: Record<string, string> = {
    Normal: 'Thông thoáng, không gian rộng, giá hợp lý',
    AirConditioner: 'Máy lạnh hiện đại, sân cao cấp, dịch vụ VIP',
    Private: 'Không gian riêng tư, ánh sáng tốt, phù hợp thi đấu',
};

export const getZones = async (): Promise<FeatureZone[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/zones`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorMessage = `HTTP error! Status: ${response.status} - ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const data: Zones[] = await response.json();

        if (!Array.isArray(data)) {
            const errorMessage = 'Invalid response format: Expected an array of zones';
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        // Map the English descriptions to Vietnamese features and ensure ZoneFeature type
        const translatedData: FeatureZone[] = data.map((zone) => ({
            ...zone,
            feature: featureTranslations[zone.zonetype || 'Không có thông tin'] || 'Không có thông tin',
        }));

        return translatedData;
    } catch (error) {
        console.error('Error fetching zones:', error);
        throw new Error('Failed to fetch zones');
    }
};
