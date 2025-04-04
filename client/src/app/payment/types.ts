// /app/payment/types.ts

export interface Filters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
    fixedCourt?: boolean;
}

export interface Courts {
    courtid: number;
    courtname?: string;
    courtprice: string;
    courtimgurl?: string;
    avgrating?: number;
    status?: string;
    zoneid?: number;
    zones?: Zones;
}

export interface SelectedCourt extends Courts {
    filters: Filters;
}

export interface Products {
    productid: number;
    productname?: string;
    producttype?: string;
    batch?: string;
    expirydate?: Date;
    status?: string;
    stockquantity?: number;
    sellingprice?: number;
    rentalprice?: number;
    costprice?: number;
    productimgurl?: string;
    createdat?: Date;
    updatedat?: Date;
}

export interface SelectedProducts extends Products {
    quantity: number;
}

export interface ZonePrices {
    zonepriceid: number;
    dayfrom?: string;
    dayto?: string;
    starttime?: string;
    endtime?: string;
    price: number;
    createdat?: Date;
    updatedat?: Date;
    zoneid: number;
    zones?: Zones;
}

export interface Zones {
    zoneid: number;
    zonename?: string;
    zonetype?: string;
    zoneimgurl?: string;
    courts?: Courts[];
    zone_prices?: ZonePrices[];
}
