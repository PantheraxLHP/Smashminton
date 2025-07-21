import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const formData = await request.formData();

        const courtid = Number(formData.get('courtid'));
        const courtname = formData.get('courtname')?.toString();
        const statuscourt = formData.get('statuscourt')?.toString();
        const avgrating = Number(formData.get('avgrating'));
        const timecalculateavg = formData.get('timecalculateavg')?.toString();
        const zoneid = Number(formData.get('zoneid'));
        const courtimgurl = formData.get('courtimgurl') as File | null;

        if (!courtid) {
            return ApiResponse.error('Thiếu courtid trong form data!');
        }

        const uploadData = new FormData();
        uploadData.append('courtname', courtname ?? '');
        uploadData.append('statuscourt', statuscourt ?? '');
        uploadData.append('avgrating', avgrating.toString());
        uploadData.append('timecalculateavg', timecalculateavg ?? '');
        uploadData.append('zoneid', zoneid.toString());
        if (courtimgurl && courtimgurl instanceof Blob) {
            uploadData.append('courtimgurl', courtimgurl);
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/courts/${courtid}`, {
            method: 'PATCH',
            body: uploadData,
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            const message = result?.message || `Lỗi server! Mã lỗi: ${response.status}`;
            return NextResponse.json({ message }, { status: response.status });
        }

        return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
        console.error('[ERROR] PATCH route exception:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Lỗi khi cập nhật sân' },
            { status: 500 }
        );
    }
}
