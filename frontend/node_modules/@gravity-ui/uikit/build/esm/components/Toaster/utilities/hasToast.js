import { getToastIndex } from './getToastIndex';
export function hasToast(toasts, name) {
    return getToastIndex(toasts, name) !== -1;
}
