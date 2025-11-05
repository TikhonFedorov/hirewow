"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConditionallyControlledState = void 0;
const useStateWithCallback_1 = require("../useStateWithCallback");
function useConditionallyControlledState(property, setProperty, initialState, isControlled = property !== undefined && setProperty !== undefined) {
    const state = (0, useStateWithCallback_1.useStateWithCallback)((property || initialState), setProperty);
    if (isControlled) {
        return [property, setProperty];
    }
    return state;
}
exports.useConditionallyControlledState = useConditionallyControlledState;
