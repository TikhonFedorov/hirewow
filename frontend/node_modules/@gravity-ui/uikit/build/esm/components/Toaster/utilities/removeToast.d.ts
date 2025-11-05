import type { ToastProps } from '../types';
export declare function removeToast<T extends ToastProps>(toasts: T[], name: ToastProps['name']): T[];
