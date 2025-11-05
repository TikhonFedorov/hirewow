"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToastIndex = void 0;
function getToastIndex(toasts, name) {
    return toasts.findIndex((toast) => toast.name === name);
}
exports.getToastIndex = getToastIndex;
