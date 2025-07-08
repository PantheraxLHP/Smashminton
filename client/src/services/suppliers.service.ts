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
    products: { productid: number; costprice: number }[];
}) {
    try {
        const mappedData = {
            ...data,
            supplies: data.products.map(product => ({
                productid: product.productid,
                costprice: product.costprice
            })),
        };

        const response = await fetch('/api/suppliers/post-suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(mappedData),
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
        products_costs?: { productid: number; costprice: number }[];
    }
) => {
    try {
        const response = await fetch(`/api/suppliers/patch-suppliers?supplierid=${supplierid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] patchSuppliers failed:', result);
            return ServiceResponse.error(result.message || 'Không thể cập nhật nhà cung cấp');
        }

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
        const response = await fetch(`/api/suppliers/delete-suppliers?supplierid=${supplierid}`, {
            method: 'PATCH',
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] deleteSupplier failed:', result);
            return ServiceResponse.error(result.message || 'Không thể xoá nhà cung cấp');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('[ERROR] deleteSupplier exception:', error);
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể xoá nhà cung cấp'
        );
    }
};

export const deleteSupplyProduct = async (supplierid: number, productid: number) => {
    try {
        console.log("service sup: ", supplierid);
        console.log("service pro: ", productid);
        const response = await fetch(`/api/suppliers/delete-supply-product?supplierid=${supplierid}&productid=${productid}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] deleteSupplyProduct failed:', result);
            return ServiceResponse.error(result.message || 'Không thể xoá nhà cung cấp khỏi sản phẩm');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('[ERROR] deleteSupplyProduct exception:', error);
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể xoá nhà cung cấp khỏi sản phẩm'
        );
    }
};

