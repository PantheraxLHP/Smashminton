import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const responseBody = await res.json();

        if (!res.ok) {
            // Forward the error from the backend to the client
            return NextResponse.json(responseBody, { status: res.status });
        }

        return NextResponse.json(responseBody);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}
