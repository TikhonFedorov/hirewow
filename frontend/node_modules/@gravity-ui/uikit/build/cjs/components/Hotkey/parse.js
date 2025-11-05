"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeyGroups = void 0;
const tslib_1 = require("tslib");
const capitalize_1 = tslib_1.__importDefault(require("lodash/capitalize"));
const uniqBy_1 = tslib_1.__importDefault(require("lodash/uniqBy"));
const utils_1 = require("./utils");
const GROUPS_SEPARATOR = /\s/;
const KEYS_SEPARATOR = '+';
function parseKeyGroups(defs, value) {
    return (0, utils_1.split)(value, GROUPS_SEPARATOR).map((keys) => (0, uniqBy_1.default)((0, utils_1.split)(keys, KEYS_SEPARATOR)
        .map(keyParser(defs))
        .sort((a, b) => b.priority - a.priority), // high to low
    (key) => key.id).map(renderKey));
}
exports.parseKeyGroups = parseKeyGroups;
function keyParser(defs) {
    return function (raw) {
        var _a;
        const keyId = getKeyId(defs, raw);
        return {
            raw,
            id: keyId,
            priority: (_a = defs.Priority[keyId]) !== null && _a !== void 0 ? _a : 0,
            displayName: defs.DisplayName[keyId],
        };
    };
}
function getKeyId(defs, val) {
    var _a;
    val = val.toLowerCase();
    return (_a = defs.NormalizeMap[val]) !== null && _a !== void 0 ? _a : val;
}
function renderKey(key) {
    var _a;
    return (_a = key.displayName) !== null && _a !== void 0 ? _a : (0, capitalize_1.default)(key.id);
}
