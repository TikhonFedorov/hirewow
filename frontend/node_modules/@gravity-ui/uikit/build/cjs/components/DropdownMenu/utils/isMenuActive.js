"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMenuActive = void 0;
const stringifyNavigationPath_1 = require("./stringifyNavigationPath");
function isMenuActive(path, activeMenuPath) {
    return (0, stringifyNavigationPath_1.stringifyNavigationPath)(path) === (0, stringifyNavigationPath_1.stringifyNavigationPath)(activeMenuPath);
}
exports.isMenuActive = isMenuActive;
