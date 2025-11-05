"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveBack = void 0;
function moveBack(items, activeItemIndex, steps = 1, skip) {
    const newActiveItemIndex = (items.length + activeItemIndex - (steps % items.length)) % items.length;
    if (skip && skip(items[newActiveItemIndex])) {
        return moveBack(items, newActiveItemIndex, 1, skip);
    }
    return newActiveItemIndex;
}
exports.moveBack = moveBack;
