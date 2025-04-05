import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        (await cookies()).delete('accessToken');
        (await cookies()).delete('refreshToken');

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
