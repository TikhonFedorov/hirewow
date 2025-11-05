"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = exports.isMac = void 0;
const isMac = () => typeof navigator !== 'undefined' ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false;
exports.isMac = isMac;
function split(val, separator) {
    return val.trim().split(separator).filter(Boolean);
}
exports.split = split;
