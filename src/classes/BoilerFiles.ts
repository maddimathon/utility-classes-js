/**
 * Generates file content (usually JSON) for various config files I often use in
 * development.  An easy way to have flexible boilerplate config.
 *
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @author Maddi Mathon (www.maddimathon.com)
 * @link {{CURRENT_URL}}
 *
 * @license MIT
 *
 * @since {{PKG_VERSION}}
 */
/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */

import type { Config as JestConfig } from 'jest';

import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';

import type { TsConfig } from '../types/jsonSchemas.js';

interface BoilerFilesOpts extends AbstractCoreOpts {
    prettyPrint: boolean,
    jest: {
        default: JestConfig,
    },
    tsConfig: {
        default: Partial<TsConfig>;
        presets: {
            universal: Partial<TsConfig>;

            astro: Partial<TsConfig>;
            node: Partial<TsConfig>;
            npm: Partial<TsConfig>;
        };
    };
};

type BoilerFileMethodKey = keyof BoilerFiles & ( "jest" | "tsConfig" );

/**
 * Generates the contents for a variety of config files.
 */
class BoilerFiles extends AbstractCore<BoilerFilesOpts> {

    /** 
     * @member _obj  Use the functions without configuration (alternative to 
     *               making all methods static).
     * @private
     * @static
     */
    static #static: BoilerFiles;

    /**
     * @member st  Use the functions without configuration.
     * @static
     */
    public static get st(): BoilerFiles {

        if ( typeof BoilerFiles.#static === 'undefined' ) {
            BoilerFiles.#static = new BoilerFiles();
        }
        return BoilerFiles.#static;
    }



    /** # LOCAL
     ** ==================================================================== **/

    /** 
     * @member _defaultOpts  
     * @protected
     * @override
     */
    public override get optsDefault(): BoilerFilesOpts {

        let opts: BoilerFilesOpts = {
            ...AbstractCoreOptsDefault,
            prettyPrint: true,
            jest: {
                default: {
                    coverageDirectory: 'tests/results/coverage',
                },
            },
            tsConfig: {
                default: {
                    compilerOptions: {

                        /** Type Checking **/
                        noFallthroughCasesInSwitch: true,
                        noImplicitAny: true,
                        noImplicitOverride: true,
                        noImplicitReturns: true,
                        noImplicitThis: true,
                        strictBindCallApply: true,

                        /** Modules **/

                        /** Emit **/

                        /** JavaScript Support **/

                        /** Editor Support **/

                        /** Interop Constraints **/
                        forceConsistentCasingInFileNames: true,

                        /** Backwards Compatibility **/

                        /** Language and Environment **/
                        target: "es6",
                        lib: [
                            "ES6",
                            "ESNext",
                            "DOM",
                        ],

                        /** Compiler Diagnostics **/

                        /** Projects **/

                        /** Output Formatting **/
                        pretty: true,

                        /** Completeness **/
                        skipLibCheck: true,

                        /** Command Line **/

                        /** Watch Options **/
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

                            /** Type Checking **/
                            noUnusedLocals: true,

                            /** Modules **/
                            baseUrl: './',
                            module: 'es6',

                            /** Emit **/
                            declaration: true,
                            declarationMap: true,
                            removeComments: true,
                            sourceMap: true,

                            /** JavaScript Support **/
                            allowJs: true,
                            checkJs: true,

                            /** Interop Constraints **/
                            esModuleInterop: true,
                        },
                    },

                    astro: {
                        extends: 'astro/tsconfigs/base',
                        compilerOptions: {

                            /** Type Checking **/
                            noUnusedLocals: undefined,

                            /** Modules **/
                            module: undefined,
                        },
                    },
                    node: {
                        compilerOptions: {

                            /** Type Checking **/
                            noUnusedLocals: undefined,

                            /** Modules **/
                            module: 'nodenext',
                            resolveJsonModule: true,

                            /** Emit **/
                            declarationMap: false,
                            sourceMap: false,

                            /** Projects **/
                            incremental: true,
                        }
                    },
                    npm: {
                        compilerOptions: {

                            /** Type Checking **/
                            noUnusedLocals: undefined,

                            /** Modules **/
                            module: 'nodenext',
                            resolveJsonModule: true,

                            /** Emit **/
                            declaration: false,
                            declarationMap: false,
                            noEmit: true,
                            sourceMap: false,

                            /** JavaScript Support **/
                            allowJs: false,
                            checkJs: false,
                        }
                    },
                },
            },
        };

        if ( typeof opts.tsConfig.default.compilerOptions === 'undefined' ) {
            opts.tsConfig.default.compilerOptions = {};
        }
        opts.tsConfig.default.compilerOptions.pretty = opts.prettyPrint;

        return opts;
    }

    /**
     * CONSTRUCTOR
     */
    constructor (
        opts: Partial<BoilerFilesOpts> = {},
    ) {
        super( opts );
    }



    /** # TSCONFIG.JSON
     ** ==================================================================== **/

    /**
     * @method jest
     * 
     * @param config  Optional. Overriding configuration values. Default {}.
     * 
     * @return  Valid JSON object to use for a jest.config.json file.
     */
    public jest(
        config: Partial<JestConfig> = {},
    ): JestConfig {
        return this.mergeArgs( this.opts.jest.default, config, true );
    }

    /**
     * @method tsConfig
     * 
     * @param config  Optional. Overriding configuration values. Default {}.
     * @param preset  Optional. A preset configuation to use. True or false 
     *                values relate to the default/universl preset values, other 
     *                options are strings. Default true.
     * 
     * @return  Valid JSON object to use for a tsConfig.json file.
     */
    public tsConfig(
        config: Partial<TsConfig> = {},
        preset: boolean | keyof BoilerFilesOpts[ 'tsConfig' ][ 'presets' ] = true,
    ): TsConfig {

        const getPresetValue = (): Partial<TsConfig> => {
            if ( preset === false ) { return {}; }

            let presetValue = {};

            if (
                typeof preset === 'string'
                && this.opts.tsConfig.presets[ preset ]
            ) {
                presetValue = this.opts.tsConfig.presets[ preset ];
            }

            return this.mergeArgs(
                this.opts.tsConfig.presets.universal,
                presetValue,
                true
            );
        };

        const presetValue: Partial<TsConfig> = getPresetValue();

        /**
         * Apply overriding config after applying the appropriate preset.
         */
        return this.mergeArgs(
            this.mergeArgs( this.opts.tsConfig.default, presetValue, true ),
            config,
            true
        );
    }
}


/** 
 * EXPORT
 */

export type {
    BoilerFileMethodKey,
    BoilerFilesOpts,
};

export {
    BoilerFiles,
};