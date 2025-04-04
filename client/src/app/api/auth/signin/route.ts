import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    const res = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
}
