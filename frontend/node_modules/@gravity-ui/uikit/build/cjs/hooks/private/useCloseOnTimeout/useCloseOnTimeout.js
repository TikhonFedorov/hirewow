"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCloseOnTimeout = void 0;
const __1 = require("../..");
const useHover_1 = require("../useHover");
/**
 * Invokes callback after given amount of time unless mouse is on the element
 *
 * @param onClose
 * @param timeout
 *
 * @return mouse event handlers
 */
function useCloseOnTimeout({ onClose, timeout }) {
    const [onMouseOver, onMouseLeave, isHovering] = (0, useHover_1.useHover)();
    (0, __1.useTimeout)(onClose, isHovering ? null : timeout);
    return { onMouseOver, onMouseLeave };
}
exports.useCloseOnTimeout = useCloseOnTimeout;
