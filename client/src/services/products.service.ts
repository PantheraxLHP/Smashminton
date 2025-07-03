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

export const getProducts3 = async (
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

        const response = await fetch(`/api/products/get-products3?${queryParams.toString()}`, {
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

export const getSingleProductFilterValue = async (id: number) => {
    try {
        const queryParams = new URLSearchParams({ id: id.toString() }).toString();

        const response = await fetch(`/api/products/get-filters-by-id?${queryParams}`, {
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

export const createProducts = async (
    formData: FormData,
    productfilterid: string,
    value: string
) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.set('productfilterid', productfilterid);
        queryParams.set('value', value);

        const response = await fetch(
            `/api/products/post-products?${queryParams.toString()}`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                status: 'error',
                message: result.message || 'Không thể tạo sản phẩm mới',
            };
        }

        return {
            status: 'success',
            product: result.data.product,
          };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu',
        };
    }
};

export const updateProducts = async (formData: FormData, id: string, batchid: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.set('productid', id);
        queryParams.set('batchid', batchid);

        const response = await fetch(
            `/api/products/update-food-accessory?${queryParams.toString()}`,
            {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                status: 'error',
                message: result.message || 'Không thể cập nhật sản phẩm',
            };
        }

        return {
            status: 'success',
            data: result.product,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu',
        };
    }
};

export const updateProductsWithoutBatch = async (formData: FormData, id: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.set('productid', id);

        const response = await fetch(
            `/api/products/update-product-without-batch?${queryParams.toString()}`,
            {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                status: 'error',
                message: result.message || 'Không thể cập nhật sản phẩm',
            };
        }

        return {
            status: 'success',
            data: result.product,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu',
        };
    }
};

export const findSupplier = async (productid: number) => {
    try {
        const response = await fetch(`/api/products/find-suppliers?productid=${productid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] findSupplier failed:', result);
            return ServiceResponse.error(result.message || 'Không thể tìm thấy nhà cung cấp');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('[ERROR] findSupplier exception:', error);
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tìm kiếm nhà cung cấp');
    }
};

export const updateService = async (formData: FormData, id: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.set('id', id);

        const response = await fetch(
            `/api/products/update-service?${queryParams.toString()}`,
            {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                status: 'error',
                message: result.message || 'Không thể cập nhật sản phẩm',
            };
        }

        return {
            status: 'success',
            data: result.product,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu',
        };
    }
};

export const deleteProduct = async (productid: number) => {
    try {
        const response = await fetch(`/api/products/delete-product?productid=${productid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                ok: false,
                message: result.message || 'Không thể xóa vật phẩm',
            };
        }

        return {
            ok: true,
            message: result.message,
        };
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        };
    }
};