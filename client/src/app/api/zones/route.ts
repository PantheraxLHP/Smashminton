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

export async function GET() {
    try {
        const response = await fetch(`${process.env.SERVER}/api/v1/zones`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Zones[] = await response.json();

        // Map the English descriptions to Vietnamese features and ensure ZoneFeature type
        const translatedData: FeatureZone[] = data.map((zone) => ({
            ...zone,
            feature: featureTranslations[zone.zonetype || 'Không có thông tin'],
        }));

        return NextResponse.json(translatedData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
    }
}
