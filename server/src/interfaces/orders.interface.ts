export interface CacheProductOrder {
    id: number;
    item: string;
    quantity: number;
    price: number;
}

export interface CacheOrder {
    username: string;
    productOrder: CacheProductOrder[];
    totalPrice: number;
}