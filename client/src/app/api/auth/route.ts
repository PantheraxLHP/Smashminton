import { Zones } from '@/types/types';
import { NextResponse } from 'next/server';

export interface UserSchema {
    username: string;
    passoword: string;
}

export async function POST() {
    try {
        const response = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        



        return NextResponse.json(translatedData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
    }
}
