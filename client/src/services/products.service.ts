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

export const getRentalFilters = async () => {
    try {
        const response = await fetch(`/api/products/get-filters`, {
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

export const getProducts = async (
    productTypeId: number,
    page: number,
    pageSize: number,
    productFilterValue?: number[],
) => {
    try {
        const queryParams = new URLSearchParams();

        if (productTypeId) {
            queryParams.set('productTypeId', productTypeId.toString());
        }

        if (productFilterValue && productFilterValue.length > 0) {
            queryParams.set('productFilterValues', productFilterValue.join(','));
        }

        if (page) {
            queryParams.set('page', page.toString());
        }

        if (pageSize) {
            queryParams.set('pageSize', pageSize.toString());
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

export const getProducts2 = async (
    productTypeId: number,
    page: number,
    pageSize: number,
    productFilterValue?: number[],
) => {
    try {
        const queryParams = new URLSearchParams();

        if (productTypeId) {
            queryParams.set('productTypeId', productTypeId.toString());
        }

        if (productFilterValue && productFilterValue.length > 0) {
            queryParams.set('productFilterValues', productFilterValue.join(','));
        }

        if (page) {
            queryParams.set('page', page.toString());
        }

        if (pageSize) {
            queryParams.set('pageSize', pageSize.toString());
        }

        const response = await fetch(`/api/products/get-products2?${queryParams.toString()}`, {
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

export const getSingleProduct = async (productId: number) => {
    try {
        const queryParams = new URLSearchParams();

        if (productId) {
            queryParams.set('productId', productId.toString());
        }

        const response = await fetch(`/api/products/get-single-product?${queryParams.toString()}`, {
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

export const getAllProducts = async () => {
    try {
        const response = await fetch(`/api/products/get-all-products`, {
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

export const getAllProductsWithBatch = async () => {
    try {
        const response = await fetch(`/api/products/get-all-products-with-batch`, {
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


export const updateProductPrice = async (
    productid: number,
    data: { price: number }
) => {
    try {
        const payload = {
            productid,
            ...data,
        };

        const response = await fetch(`/api/products/update-product-price`, {
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