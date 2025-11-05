import { stringifyNavigationPath } from './stringifyNavigationPath';
export function isMenuActive(path, activeMenuPath) {
    return stringifyNavigationPath(path) === stringifyNavigationPath(activeMenuPath);
}
