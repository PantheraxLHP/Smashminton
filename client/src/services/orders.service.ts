import { ServiceResponse } from '@/lib/serviceResponse';

export const getOrderRedis = async (username: string) => {
    try {
        const queryParams = new URLSearchParams({
            username: username || '',
        });

        const response = await fetch(`/api/orders/get-order?${queryParams.toString()}`, {
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

export const postOrder = async (orderData: { username?: string; productid?: number; returndate?: string }) => {
    try {
        if (orderData.returndate === undefined || orderData.returndate === null) {
            orderData.returndate = new Date().toISOString();
        } else {
            orderData.returndate = new Date(orderData.returndate).toISOString();
        }
        const response = await fetch('/api/orders/post-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
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

export const deleteOrder = async (orderData: { username?: string; productid?: number }) => {
    try {
        const response = await fetch('/api/orders/delete-order', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
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
