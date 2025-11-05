import type { MediaProps, MediaType } from '../types';
export declare const mockMediaQueryList: MediaQueryList;
export declare const makeCurrentActiveMediaExpressions: (mediaToValue: MediaProps<number>) => MediaProps<string>;
/**
 * @private - use `useLayoutContext` hook instead
 */
export declare const useCurrentActiveMediaQuery: (breakpointsMap: MediaProps<number>, initialMediaQuery?: MediaType) => MediaType;
