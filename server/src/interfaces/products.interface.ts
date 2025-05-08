export interface Products {
    productid: number;
    productname?: string;
    batch?: string;
    expirydate?: Date;
    status?: string;
    stockquantity?: number;
    sellingprice?: number;
    rentalprice?: number;
    costprice?: number;
    productimgurl?: string;
    producttypeid?: number;
    productdescid?: number;
    createdat?: Date;
    updatedat?: Date;
    // order_product?: OrderProduct[];
    // product_descriptions?: ProductDescriptions;
    // product_types?: ProductTypes;
    // purchase_order?: PurchaseOrder[];
}