import { NextResponse } from 'next/server';

export async function POST() {
    const res = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
}
