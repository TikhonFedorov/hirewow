import { useTimeout } from '../..';
import { useHover } from '../useHover';
/**
 * Invokes callback after given amount of time unless mouse is on the element
 *
 * @param onClose
 * @param timeout
 *
 * @return mouse event handlers
 */
export function useCloseOnTimeout({ onClose, timeout }) {
    const [onMouseOver, onMouseLeave, isHovering] = useHover();
    useTimeout(onClose, isHovering ? null : timeout);
    return { onMouseOver, onMouseLeave };
}
