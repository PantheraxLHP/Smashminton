export interface CacheProductOrder {
    productid: number;
    productname: string;
    productimgurl: string;
    unitprice?: number;
    quantity?: number;
    totalamount?: number;
}

export interface CacheOrder {
    product_order: CacheProductOrder[];
    totalprice: number;
}