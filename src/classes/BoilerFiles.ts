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
 * @since 1.0.0
 */
/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */

import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';

import type { TsConfig } from '../types/jsonSchemas.js';



/** # TYPES
 ** ======================================================================== **/

export type BoilerFileMethodKey = keyof BoilerFiles & ( "tsConfig" );


/** ## Opts Interface ==================================== **/

export interface BoilerFilesOpts extends AbstractCoreOpts {
    prettyPrint: boolean,

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



/** # CLASS
 ** ======================================================================== **/

/**
 * Generates the contents for a variety of files based on defaults.
 */
export class BoilerFiles extends AbstractCore<BoilerFilesOpts> {

    /** 
     * Use the functions without configuration (alternative to making all
     * methods static).
     */
    static #static: BoilerFiles;

    /**
     * Use the functions without configuration.
     */
    public static get st(): BoilerFiles {

        if ( typeof BoilerFiles.#static === 'undefined' ) {
            BoilerFiles.#static = new BoilerFiles();
        }
        return BoilerFiles.#static;
    }



    /** LOCAL
     ** ==================================================================== **/

    public override get optsDefault(): BoilerFilesOpts {

        const opts: BoilerFilesOpts = {
            ...AbstractCoreOptsDefault,

            prettyPrint: true,

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
        return opts;
    }

    /**
     * New version of this obj’s opts with given overrides.
     */
    protected override _getOpts( opts: Partial<BoilerFilesOpts> ): BoilerFilesOpts {

        let resultOpts: BoilerFilesOpts = super._getOpts( opts );

        if ( opts.tsConfig && opts.tsConfig.default ) {

            resultOpts.tsConfig.default = this.mergeArgs(
                resultOpts.tsConfig.default,
                opts.tsConfig.default,
                true
            );
        }

        if ( typeof resultOpts.tsConfig.default.compilerOptions == 'undefined' ) {
            resultOpts.tsConfig.default.compilerOptions = {};
        }
        resultOpts.tsConfig.default.compilerOptions.pretty = opts.tsConfig?.default?.compilerOptions?.pretty ?? resultOpts.prettyPrint;

        if ( opts.tsConfig && opts.tsConfig.presets ) {

            const presetKeys = Object.keys(
                resultOpts.tsConfig.presets
            ) as ( keyof BoilerFilesOpts[ 'tsConfig' ][ 'presets' ] )[];

            for ( const key of presetKeys ) {

                if ( opts.tsConfig.presets[ key ] ) {

                    resultOpts.tsConfig.presets[ key ] = this.mergeArgs(
                        resultOpts.tsConfig.presets[ key ],
                        opts.tsConfig.presets[ key ],
                        true
                    );
                }
            }
        }

        return resultOpts;
    }


    /** CONSTRUCTOR
     ** ==================================================================== **/

    constructor (
        opts: Partial<BoilerFilesOpts> = {},
    ) {
        super( opts );
    }



    /** TSCONFIG.JSON
     ** ==================================================================== **/

    /**
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