'use server';

export async function getServerUrlAction(): Promise<string> {
    return process.env.SERVER || 'http://localhost:8000';
}
