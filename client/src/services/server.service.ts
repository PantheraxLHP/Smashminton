import { getServerUrlAction } from '@/lib/server-actions';

export async function getServerUrl(): Promise<string> {
    try {
        return await getServerUrlAction();
    } catch (error) {
        console.error('Failed to fetch server URL, using fallback', error);
        return 'http://localhost:8000';
    }
}
