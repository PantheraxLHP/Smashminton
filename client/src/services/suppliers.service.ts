import { ServiceResponse } from '@/lib/serviceResponse';

export const getSuppliers = async (page: number, pageSize: number) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        const response = await fetch(`/api/suppliers/get-suppliers?${queryParams}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const result = await response.json();

        console.log('[DEBUG] getSuppliers full result:', result);

        const suppliers = result.data?.data;
        const pagination = result.data?.pagination;

        if (!response.ok || !Array.isArray(suppliers)) {
            return ServiceResponse.error(result.message || 'Dữ liệu trả về không hợp lệ');
        }

        return ServiceResponse.success({
            data: suppliers,
            pagination,
        });
    } catch (error) {
        console.error('[ERROR] getSuppliers:', error);
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu'
        );
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

export const deleteSupplier = async (supplierid: number) => {
    try {
        const response = await fetch(`/api/suppliers/delete-suppliers`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ supplierid }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] deleteSupplier failed:', result);
            return ServiceResponse.error(result.message || 'Không thể xoá nhà cung cấp');
        }

        console.log('[DEBUG] deleteSupplier success:', result);
        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('[ERROR] deleteSupplier exception:', error);
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể xoá nhà cung cấp');
    }
};
