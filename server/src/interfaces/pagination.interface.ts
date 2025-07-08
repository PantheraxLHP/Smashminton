export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        totalPages: number;
        //hasNext: boolean;
        //hasPrev: boolean;
    };
}