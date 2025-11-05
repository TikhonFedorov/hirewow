import type { PaginationItem, PaginationProps } from '../types';
type UsePaginationArgs = Pick<PaginationProps, 'page' | 'pageSize' | 'total'> & {
    mobile: boolean;
};
type UsePaginationReturn = {
    items: PaginationItem[];
    numberOfPages: number;
};
export declare function usePagination({ page, pageSize, total, mobile, }: UsePaginationArgs): UsePaginationReturn;
export {};
