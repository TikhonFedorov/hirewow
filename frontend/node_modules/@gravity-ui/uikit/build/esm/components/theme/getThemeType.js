import { DARK_THEMES } from './constants';
export function getThemeType(theme) {
    return DARK_THEMES.includes(theme) ? 'dark' : 'light';
}
