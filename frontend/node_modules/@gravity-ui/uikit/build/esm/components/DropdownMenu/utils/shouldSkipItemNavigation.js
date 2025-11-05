import { isSeparator } from './isSeparator';
export function shouldSkipItemNavigation(item) {
    return item.disabled || isSeparator(item);
}
