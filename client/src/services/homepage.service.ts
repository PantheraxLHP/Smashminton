import { FeatureZone } from '@/app/api/zones/route';

export async function getZones(): Promise<FeatureZone[]> {
    const response = await fetch(`${process.env.HOST}/api/zones`, {
        cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch zones');

    return response.json();
}
