import { CSS_SIZE_EXCEPTION } from '../constants';
const mediaByOrder = {
    s: 0,
    m: 1,
    l: 2,
    xl: 3,
    xxl: 4,
    xxxl: 5,
};
export const isMediaActiveFactory = (activeType) => (toCheck) => {
    return activeType in mediaByOrder
        ? mediaByOrder[activeType] - mediaByOrder[toCheck] >= 0
        : false;
};
const mediaOrder = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'];
export const getClosestMediaPropsFactory = (currentActive) => (medias = {}) => {
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
export const makeCssMod = (space) => {
    return space in CSS_SIZE_EXCEPTION ? CSS_SIZE_EXCEPTION[space] : String(space);
};
