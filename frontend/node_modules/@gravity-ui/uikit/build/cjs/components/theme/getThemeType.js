"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThemeType = void 0;
const constants_1 = require("./constants");
function getThemeType(theme) {
    return constants_1.DARK_THEMES.includes(theme) ? 'dark' : 'light';
}
exports.getThemeType = getThemeType;
