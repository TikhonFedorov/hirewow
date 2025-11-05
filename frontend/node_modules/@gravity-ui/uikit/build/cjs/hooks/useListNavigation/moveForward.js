"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveForward = void 0;
function moveForward(items, activeItemIndex, steps = 1, skip) {
    const newActiveItemIndex = (activeItemIndex + steps) % items.length;
    if (skip && skip(items[newActiveItemIndex])) {
        return moveForward(items, newActiveItemIndex, 1, skip);
    }
    return newActiveItemIndex;
}
exports.moveForward = moveForward;
