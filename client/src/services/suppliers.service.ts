import { ServiceResponse } from '@/lib/serviceResponse';

export const getSuppliers = async () => {
    try {
        const response = await fetch(`/api/suppliers/get-suppliers`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export async function postSuppliers(data: {
    suppliername: string;
    contactname: string;
    phonenumber: string;
    email: string;
    address: string;
    productids: number[];
}) {
    try {
        const response = await fetch('/api/suppliers/post-suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}

export const patchSuppliers = async (
    supplierid: number,
    data: {
        suppliername: string;
        contactname: string;
        phonenumber: string;
        email: string;
        address: string;
    }
) => {
    try {
        const payload = {
            supplierid,
            ...data,
        };

        console.log('[DEBUG] Sending patchSuppliers with JSON payload:', payload);

        const response = await fetch(`/api/suppliers/patch-suppliers`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] patchSuppliers failed:', result);
            return ServiceResponse.error(result.message || 'Không thể cập nhật nhà cung cấp');
        }

        console.log('[DEBUG] patchSuppliers success:', result);
        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('[ERROR] patchSuppliers exception:', error);
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể cập nhật nhà cung cấp'
        );
    }
};
