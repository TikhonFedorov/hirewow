"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToast = void 0;
const hasToast_1 = require("./hasToast");
function removeToast(toasts, name) {
    if (!(0, hasToast_1.hasToast)(toasts, name)) {
        return toasts;
    }
    return toasts.filter((toast) => toast.name !== name);
}
exports.removeToast = removeToast;
