"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyNavigationPath = void 0;
function stringifyNavigationPath(path) {
    var _a;
    return (_a = path === null || path === void 0 ? void 0 : path.join(' ')) !== null && _a !== void 0 ? _a : '';
}
exports.stringifyNavigationPath = stringifyNavigationPath;
