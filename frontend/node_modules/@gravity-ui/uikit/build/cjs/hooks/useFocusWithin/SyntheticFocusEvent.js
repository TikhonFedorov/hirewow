"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntheticFocusEvent = void 0;
class SyntheticFocusEvent {
    constructor(type, nativeEvent, override = {}) {
        var _a, _b;
        this.nativeEvent = nativeEvent;
        this.target = ((_a = override.target) !== null && _a !== void 0 ? _a : nativeEvent.target);
        this.currentTarget = ((_b = override.currentTarget) !== null && _b !== void 0 ? _b : nativeEvent.currentTarget);
        this.relatedTarget = nativeEvent.relatedTarget;
        this.bubbles = nativeEvent.bubbles;
        this.cancelable = nativeEvent.cancelable;
        this.defaultPrevented = nativeEvent.defaultPrevented;
        this.eventPhase = nativeEvent.eventPhase;
        this.isTrusted = nativeEvent.isTrusted;
        this.timeStamp = nativeEvent.timeStamp;
        this.type = type;
    }
    isDefaultPrevented() {
        return this.nativeEvent.defaultPrevented;
    }
    preventDefault() {
        this.defaultPrevented = true;
        this.nativeEvent.preventDefault();
    }
    stopPropagation() {
        this.nativeEvent.stopPropagation();
        this.isPropagationStopped = () => true;
    }
    isPropagationStopped() {
        return false;
    }
    persist() { }
}
exports.SyntheticFocusEvent = SyntheticFocusEvent;
