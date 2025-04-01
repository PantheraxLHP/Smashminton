import { NextResponse } from 'next/server';

export interface SigninAuth {
    username: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        // Parse the request body
        const body: SigninAuth = await req.json();

        // Make the POST request to the backend API
        const response = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message || 'Failed to sign in' }, { status: response.status });
        }

        // Parse the response from the backend
        const data = await response.json();

        // Return the response to the client
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST /api/auth:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
