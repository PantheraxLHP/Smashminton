export async function getAccessToken(): Promise<string | null> {
    try {
        const response = await fetch('/api/auth/session', {
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const session = await response.json();

        return session.data?.accessToken || null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}
