/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
var __classPrivateFieldGet = ( this && this.__classPrivateFieldGet ) || function ( receiver, state, kind, f ) {
    if ( kind === "a" && !f ) throw new TypeError( "Private accessor was defined without a getter" );
    if ( typeof state === "function" ? receiver !== state || !f : !state.has( receiver ) ) throw new TypeError( "Cannot read private member from an object whose class did not declare it" );
    return kind === "m" ? f : kind === "a" ? f.call( receiver ) : f ? f.value : state.get( receiver );
};
var __classPrivateFieldSet = ( this && this.__classPrivateFieldSet ) || function ( receiver, state, value, kind, f ) {
    if ( kind === "m" ) throw new TypeError( "Private method is not writable" );
    if ( kind === "a" && !f ) throw new TypeError( "Private accessor was defined without a setter" );
    if ( typeof state === "function" ? receiver !== state || !f : !state.has( receiver ) ) throw new TypeError( "Cannot write private member to an object whose class did not declare it" );
    return ( kind === "a" ? f.call( receiver, value ) : f ? f.value = value : state.set( receiver, value ) ), value;
};
var _a, _BoilerFiles_static;
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';
;
export class BoilerFiles extends AbstractCore {
    static get st() {
        if ( typeof __classPrivateFieldGet( _a, _a, "f", _BoilerFiles_static ) === 'undefined' ) {
            __classPrivateFieldSet( _a, _a, new _a(), "f", _BoilerFiles_static );
        }
        return __classPrivateFieldGet( _a, _a, "f", _BoilerFiles_static );
    }
    get optsDefault() {
        const opts = Object.assign( Object.assign( {}, AbstractCoreOptsDefault ), {
            prettyPrint: true, tsConfig: {
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
            }
        } );
        return opts;
    }
    _getOpts( opts ) {
        var _b, _c, _d, _e;
        let resultOpts = super._getOpts( opts );
        if ( opts.tsConfig && opts.tsConfig.default ) {
            resultOpts.tsConfig.default = this.mergeArgs( resultOpts.tsConfig.default, opts.tsConfig.default, true );
        }
        if ( typeof resultOpts.tsConfig.default.compilerOptions == 'undefined' ) {
            resultOpts.tsConfig.default.compilerOptions = {};
        }
        resultOpts.tsConfig.default.compilerOptions.pretty = ( _e = ( _d = ( _c = ( _b = opts.tsConfig ) === null || _b === void 0 ? void 0 : _b.default ) === null || _c === void 0 ? void 0 : _c.compilerOptions ) === null || _d === void 0 ? void 0 : _d.pretty ) !== null && _e !== void 0 ? _e : resultOpts.prettyPrint;
        if ( opts.tsConfig && opts.tsConfig.presets ) {
            const presetKeys = Object.keys( resultOpts.tsConfig.presets );
            for ( const key of presetKeys ) {
                if ( opts.tsConfig.presets[ key ] ) {
                    resultOpts.tsConfig.presets[ key ] = this.mergeArgs( resultOpts.tsConfig.presets[ key ], opts.tsConfig.presets[ key ], true );
                }
            }
        }
        return resultOpts;
    }
    constructor ( opts = {} ) {
        super( opts );
    }
    tsConfig( config = {}, preset = true ) {
        const getPresetValue = () => {
            if ( preset === false ) {
                return {};
            }
            let presetValue = {};
            if ( typeof preset === 'string'
                && this.opts.tsConfig.presets[ preset ] ) {
                presetValue = this.opts.tsConfig.presets[ preset ];
            }
            return this.mergeArgs( this.opts.tsConfig.presets.universal, presetValue, true );
        };
        const presetValue = getPresetValue();
        return this.mergeArgs( this.mergeArgs( this.opts.tsConfig.default, presetValue, true ), config, true );
    }
}
_a = BoilerFiles;
_BoilerFiles_static = { value: void 0 };
