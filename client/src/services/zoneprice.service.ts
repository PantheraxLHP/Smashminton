import { ServiceResponse } from '@/lib/serviceResponse';

export const getZonePrices = async () => {
    try {
        const response = await fetch(`/api/zoneprice/getall-zoneprice`, {
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

export const patchZonePrices = async (
    zonepriceid: number,
    data: { price: number }
) => {
    try {
        const payload = {
            zonepriceid,
            ...data,
        };

        const response = await fetch(`/api/zoneprice/patch-zoneprices`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể cập nhật giá khu vực');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể cập nhật giá khu vực'
        );
    }
};
