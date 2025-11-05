"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubmenuOpen = void 0;
function isSubmenuOpen(path, activeMenuPath) {
    var _a;
    return (_a = path === null || path === void 0 ? void 0 : path.every((item, index) => item === (activeMenuPath === null || activeMenuPath === void 0 ? void 0 : activeMenuPath[index]))) !== null && _a !== void 0 ? _a : false;
}
exports.isSubmenuOpen = isSubmenuOpen;
