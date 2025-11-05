import { hasToast } from './hasToast';
export function removeToast(toasts, name) {
    if (!hasToast(toasts, name)) {
        return toasts;
    }
    return toasts.filter((toast) => toast.name !== name);
}
