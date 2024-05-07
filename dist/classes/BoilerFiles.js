/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _BoilerFiles_static;
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';
;
class BoilerFiles extends AbstractCore {
    static get st() {
        if (typeof __classPrivateFieldGet(_a, _a, "f", _BoilerFiles_static) === 'undefined') {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _BoilerFiles_static);
        }
        return __classPrivateFieldGet(_a, _a, "f", _BoilerFiles_static);
    }
    get optsDefault() {
        let opts = Object.assign(Object.assign({}, AbstractCoreOptsDefault), { prettyPrint: true, jest: {
                default: {
                    coverageDirectory: 'tests/results/coverage',
                },
            }, tsConfig: {
                default: {
                    compilerOptions: {
                        noFallthroughCasesInSwitch: true,
                        noImplicitAny: true,
                        noImplicitOverride: true,
                        noImplicitReturns: true,
                        noImplicitThis: true,
                        strictBindCallApply: true,
                        forceConsistentCasingInFileNames: true,
                        target: "es6",
                        lib: [
                            "ES6",
                            "ESNext",
                            "DOM",
                        ],
                        pretty: true,
                        skipLibCheck: true,
                    },
                },
                presets: {
                    universal: {
                        extends: '@tsconfig/recommended/tsconfig.json',
                        exclude: [
                            '**/._*',
                            '**/._*/**/*',
                        ],
                        compilerOptions: {
                            noUnusedLocals: true,
                            baseUrl: './',
                            module: 'es6',
                            declaration: true,
                            declarationMap: true,
                            removeComments: true,
                            sourceMap: true,
                            allowJs: true,
                            checkJs: true,
                            esModuleInterop: true,
                        },
                    },
                    astro: {
                        extends: 'astro/tsconfigs/base',
                        compilerOptions: {
                            noUnusedLocals: undefined,
                            module: undefined,
                        },
                    },
                    node: {
                        compilerOptions: {
                            noUnusedLocals: undefined,
                            module: 'nodenext',
                            resolveJsonModule: true,
                            declarationMap: false,
                            sourceMap: false,
                            incremental: true,
                        }
                    },
                    npm: {
                        compilerOptions: {
                            noUnusedLocals: undefined,
                            module: 'nodenext',
                            resolveJsonModule: true,
                            declaration: false,
                            declarationMap: false,
                            noEmit: true,
                            sourceMap: false,
                            allowJs: false,
                            checkJs: false,
                        }
                    },
                },
            } });
        if (typeof opts.tsConfig.default.compilerOptions === 'undefined') {
            opts.tsConfig.default.compilerOptions = {};
        }
        opts.tsConfig.default.compilerOptions.pretty = opts.prettyPrint;
        return opts;
    }
    constructor(opts = {}) {
        super(opts);
    }
    jest(config = {}) {
        return this.mergeArgs(this.opts.jest.default, config, true);
    }
    tsConfig(config = {}, preset = true) {
        const getPresetValue = () => {
            if (preset === false) {
                return {};
            }
            let presetValue = {};
            if (typeof preset === 'string'
                && this.opts.tsConfig.presets[preset]) {
                presetValue = this.opts.tsConfig.presets[preset];
            }
            return this.mergeArgs(this.opts.tsConfig.presets.universal, presetValue, true);
        };
        const presetValue = getPresetValue();
        return this.mergeArgs(this.mergeArgs(this.opts.tsConfig.default, presetValue, true), config, true);
    }
}
_a = BoilerFiles;
_BoilerFiles_static = { value: void 0 };
export { BoilerFiles, };
