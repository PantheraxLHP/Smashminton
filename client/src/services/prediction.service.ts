const API_BASE = process.env.SERVER || 'http://localhost:8000';

export interface PredictionRatioItem {
    id: string;
    name: string;
    quantity: number;
}

export interface SalesPurchaseItem {
    name: string;
    sales: number;
    purchase: number;
}

export interface PredictionFilters {
    type: 'month' | 'quarter';
    month?: number;
    quarter?: number;
    year: number;
}

export interface PredictionData {
    soldRatio: PredictionRatioItem[];
    purchasedRatio: PredictionRatioItem[];
    salesPurchase: SalesPurchaseItem[];
}

export async function getPredictionData(filters: PredictionFilters): Promise<PredictionData> {
    try {
        const params = new URLSearchParams({
            type: filters.type,
            year: filters.year.toString(),
        });

        if (filters.type === 'month' && filters.month) {
            params.append('month', filters.month.toString());
        }

        if (filters.type === 'quarter' && filters.quarter) {
            params.append('quarter', filters.quarter.toString());
        }

        // Use Next.js built-in fetch with caching
        const [soldRatioRes, purchasedRatioRes, salesPurchaseRes] = await Promise.all([
            fetch(`${API_BASE}/api/v1/admin/prediction/sold-ratio-by-filter-value?${params}`, {
                next: { revalidate: 300 }, // Cache for 5 minutes
            }),
            fetch(`${API_BASE}/api/v1/admin/prediction/purchased-ratio-by-filter-value?${params}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/prediction/sales-purchase-by-filter-value?${params}`, {
                next: { revalidate: 300 },
            }),
        ]);

        // Check which requests were successful and handle partial failures
        const responses = [soldRatioRes, purchasedRatioRes, salesPurchaseRes];

        const failedRequests: string[] = [];
        responses.forEach((res, index) => {
            if (!res.ok) {
                const endpoints = [
                    'sold-ratio-by-filter-value',
                    'purchased-ratio-by-filter-value',
                    'sales-purchase-by-filter-value',
                ];
                failedRequests.push(endpoints[index]);
                console.warn(`API request failed for ${endpoints[index]}: ${res.status} ${res.statusText}`);
            }
        });

        if (failedRequests.length === responses.length) {
            throw new Error('All API requests failed');
        }

        const data = await Promise.all([
            soldRatioRes.ok ? soldRatioRes.json().catch(() => []) : [],
            purchasedRatioRes.ok ? purchasedRatioRes.json().catch(() => []) : [],
            salesPurchaseRes.ok ? salesPurchaseRes.json().catch(() => []) : [],
        ]);

        // Transform data to match chart expectations (if needed)
        const transformedSoldRatio =
            data[0]?.map((item: any, index: number) => ({
                id: String(item.productfilter_value_id ?? index),
                name: item.productfilter_value_name || '',
                quantity: typeof item.ratio === 'number' ? item.ratio : 0,
            })) || [];

        const transformedPurchasedRatio = Array.isArray(data[1])
            ? data[1].map((item: any, index: number) => ({
                  id: String(item.productfilter_value_id ?? index),
                  name: item.productfilter_value_name || '',
                  quantity: Number.isFinite(item.ratio) ? item.ratio : 0,
              }))
            : [];

        const transformedSalesPurchase = Array.isArray(data[2])
            ? data[2].map((item: any, index: number) => ({
                  name: item.productfilter_value_name || `Sản phẩm ${index + 1}`,
                  sales: Number.isFinite(item.sales) ? item.sales : 0,
                  purchase: Number.isFinite(item.purchase) ? item.purchase : 0,
              }))
            : [];

        return {
            soldRatio: transformedSoldRatio,
            purchasedRatio: transformedPurchasedRatio,
            salesPurchase: transformedSalesPurchase,
        };
    } catch (error) {
        console.error('Prediction data fetch error:', error);
        throw new Error('Failed to fetch prediction data');
    }
}

export interface PredictionTable {
    id: string;
    name: string;
}

export interface PredictionTableFilters {
    type: 'month' | 'quarter';
    month?: number;
    quarter?: number;
}

export async function getPredictionDataTable(filters: PredictionTableFilters): Promise<PredictionTable[]> {
    try {
        const params = new URLSearchParams({
            filter_type: filters.type,
        });

        if (filters.type === 'month' && filters.month) {
            params.append('value', filters.month.toString());
        }

        if (filters.type === 'quarter' && filters.quarter) {
            params.append('value', filters.quarter.toString());
        }
        console.log(params.toString());

        const response = await fetch(`${API_BASE}/api/v1/admin/prediction/predict-bestseller-by-time?${params}`, {
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch prediction table');
        }

        const data = await response.json();

        return data.map((item: any) => ({
            id: item.productfiltervalueid,
            name: item.value,
        }));
    } catch (error) {
        console.error('Prediction table fetch error:', error);
        throw new Error('Failed to fetch prediction table');
    }
}
