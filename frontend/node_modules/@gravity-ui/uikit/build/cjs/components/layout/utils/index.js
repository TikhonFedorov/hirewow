"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCssMod = exports.getClosestMediaPropsFactory = exports.isMediaActiveFactory = void 0;
const constants_1 = require("../constants");
const mediaByOrder = {
    s: 0,
    m: 1,
    l: 2,
    xl: 3,
    xxl: 4,
    xxxl: 5,
};
const isMediaActiveFactory = (activeType) => (toCheck) => {
    return activeType in mediaByOrder
        ? mediaByOrder[activeType] - mediaByOrder[toCheck] >= 0
        : false;
};
exports.isMediaActiveFactory = isMediaActiveFactory;
const mediaOrder = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'];
const getClosestMediaPropsFactory = (currentActive) => (medias = {}) => {
    if (!currentActive) {
        return undefined;
    }
    let candidate = currentActive;
    while (candidate) {
        if (medias[candidate]) {
            return medias[candidate];
        }
        candidate = mediaOrder[mediaByOrder[candidate] - 1];
    }
    return undefined;
};
exports.getClosestMediaPropsFactory = getClosestMediaPropsFactory;
const makeCssMod = (space) => {
    return space in constants_1.CSS_SIZE_EXCEPTION ? constants_1.CSS_SIZE_EXCEPTION[space] : String(space);
};
exports.makeCssMod = makeCssMod;
