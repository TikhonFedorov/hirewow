"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXpath = exports.withoutClassMods = void 0;
const tslib_1 = require("tslib");
const blueimp_md5_1 = tslib_1.__importDefault(require("blueimp-md5"));
const class_transform_1 = require("./class-transform");
function withoutClassMods(converter = (arg) => arg) {
    return (parsedClass, strClass) => parsedClass.mod ? undefined : converter(parsedClass, strClass);
}
exports.withoutClassMods = withoutClassMods;
function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
function getXpathByNode(node, options) {
    if (!node || !isElement(node)) {
        return '';
    }
    const tag = node.tagName.toLowerCase();
    let token = `/${tag}`;
    const convertedId = node.id && !options.withoutId ? options.idConverter(node.id) : undefined;
    if (convertedId) {
        token += `[@id='${convertedId}']`;
    }
    else {
        const classes = [];
        node.classList.forEach((className) => {
            const currentClass = options.classConverter(Object.assign(Object.assign({}, (0, class_transform_1.parseClass)(className)), { tag }), className);
            if (currentClass) {
                classes.push((0, class_transform_1.formatClass)(currentClass));
            }
        });
        if (classes.length) {
            token += `[@class='${classes.join(' ')}']`;
        }
    }
    return getXpathByNode(node.parentElement, options) + token;
}
const defaultXpathOptions = {
    classConverter: (arg) => arg,
    idConverter: (arg) => arg,
    withoutId: false,
};
function getXpath(event, options) {
    const internalOptions = Object.assign(Object.assign({}, defaultXpathOptions), (options || {}));
    const xpath = getXpathByNode(event.currentTarget || event.target, internalOptions);
    return {
        xpath,
        hash: (0, blueimp_md5_1.default)(xpath),
    };
}
exports.getXpath = getXpath;
