import capitalize from 'lodash/capitalize';
import uniqBy from 'lodash/uniqBy';
import { split } from './utils';
const GROUPS_SEPARATOR = /\s/;
const KEYS_SEPARATOR = '+';
export function parseKeyGroups(defs, value) {
    return split(value, GROUPS_SEPARATOR).map((keys) => uniqBy(split(keys, KEYS_SEPARATOR)
        .map(keyParser(defs))
        .sort((a, b) => b.priority - a.priority), // high to low
    (key) => key.id).map(renderKey));
}
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
    return (_a = key.displayName) !== null && _a !== void 0 ? _a : capitalize(key.id);
}
