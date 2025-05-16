import { ServiceResponse } from '@/lib/serviceResponse';

export const getProductFilters = async () => {
    try {
        const response = await fetch(`/api/products/get-filters`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const result = await response.json();
        const filteredData = result.data.filter((item: any) => item.producttypeid === 1 || item.producttypeid === 2);

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(filteredData);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const getRentFilters = async () => {
    try {
        const response = await fetch(`/api/products/get-rent-filters`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const result = await response.json();
        const filteredData = result.data.filter((item: any) => item.producttypeid === 3 || item.producttypeid === 4);

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(filteredData);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const getProducts = async (productTypeId: string, productFilterValue?: string) => {
    try {
        const queryParams = new URLSearchParams();

        if (productTypeId) {
            queryParams.set('productTypeId', productTypeId);
        }

        if (productFilterValue) {
            queryParams.set('productFilterValue', productFilterValue);
        }

        const response = await fetch(`/api/products/get-products?${queryParams.toString()}`, {
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
