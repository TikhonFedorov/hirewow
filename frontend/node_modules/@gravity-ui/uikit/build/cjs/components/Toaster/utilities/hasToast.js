"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasToast = void 0;
const getToastIndex_1 = require("./getToastIndex");
function hasToast(toasts, name) {
    return (0, getToastIndex_1.getToastIndex)(toasts, name) !== -1;
}
exports.hasToast = hasToast;
