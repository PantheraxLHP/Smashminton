export interface CacheProductOrder {
    productid: number;
    productname: string;
    productimgurl: string;
    unitprice?: number;
    quantity?: number;
    returndate?: string;
    totalamount?: number;
}

export interface CacheOrder {
    product_order: CacheProductOrder[];
    totalprice: number;
}
export interface Order {
  orderid: number;
  ordertype?: string;
  orderdate?: Date;
  totalprice?: number;
  status?: string;
  employeeid?: number;
  customerid?: number;
}