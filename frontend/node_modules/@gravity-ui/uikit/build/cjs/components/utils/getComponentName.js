"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentName = void 0;
function getComponentName(Component) {
    return Component.displayName || Component.name || 'Component';
}
exports.getComponentName = getComponentName;
