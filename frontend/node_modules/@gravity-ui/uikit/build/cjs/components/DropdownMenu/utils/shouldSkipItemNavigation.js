"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldSkipItemNavigation = void 0;
const isSeparator_1 = require("./isSeparator");
function shouldSkipItemNavigation(item) {
    return item.disabled || (0, isSeparator_1.isSeparator)(item);
}
exports.shouldSkipItemNavigation = shouldSkipItemNavigation;
