/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */
;
const AbstractCoreOptsDefault = {
    tabWidth: 4,
    tabCharacter: ' ',
    ansiEscape: '\x1b',
    ansiColours: {
        red: "2;165;44;50",
        orange: "2;147;63;34",
        yellow: "2;122;80;0",
        green: "2;24;103;31",
        turquoise: "2;4;98;76",
        blue: "2;45;91;134",
        purple: "2;121;60;150",
        pink: "2;143;56;114",
        grey: "2;91;87;88",
        white: "2;245;245;245",
        black: "2;51;51;51",
    },
};
class AbstractCore {
    _getOpts(opts) {
        var _a;
        return this.parseArgs((_a = this.opts) !== null && _a !== void 0 ? _a : this.optsDefault, opts, true);
    }
    constructor(opts = {}) {
        this.opts = this._getOpts(opts);
    }
    typeOf(variable) {
        if (variable === null) {
            return 'null';
        }
        if (variable === undefined) {
            return 'undefined';
        }
        const type_of = typeof variable;
        switch (type_of) {
            case 'function':
                return typeof variable.prototype === 'undefined'
                    ? 'function'
                    : 'class';
            case 'number':
                if (isNaN(variable)) {
                    return 'NaN';
                }
                break;
        }
        return type_of;
    }
    toString() { return JSON.stringify(this, null, 4); }
    valueOf() { return this; }
    get tab() {
        return this.opts.tabCharacter.repeat(this.opts.tabWidth);
    }
    escRegExp(convertMe) {
        return convertMe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    escRegExpReplace(convertMe) {
        return convertMe.replace(/\$/g, '$$$$');
    }
    _combineArgs(defaults, inputs, recursive, includeAllInputKeys) {
        var _a;
        if (typeof inputs !== 'object' || !inputs) {
            return Object.assign({}, defaults);
        }
        let result = Object.assign({}, defaults);
        for (const _key of Object.getOwnPropertyNames(inputs)) {
            const key = _key;
            if (includeAllInputKeys == false
                && typeof defaults[key] === 'undefined') {
                continue;
            }
            if (recursive
                && typeof defaults[key] === 'object'
                && typeof inputs[key] === 'object'
                && !Array.isArray(defaults[key])
                && !Array.isArray(inputs[key])) {
                result[key] = this._combineArgs(defaults[key], inputs[key], recursive, includeAllInputKeys);
            }
            else {
                result[key] = ((_a = inputs[key]) !== null && _a !== void 0 ? _a : defaults[key]);
            }
        }
        return result;
    }
    mergeArgs(defaults, inputs, recursive = false) {
        return this._combineArgs(defaults, inputs, recursive, true);
    }
    parseArgs(defaults, inputs, recursive = false) {
        return this._combineArgs(defaults, inputs, recursive, false);
    }
}
export { AbstractCoreOptsDefault, AbstractCore, };
