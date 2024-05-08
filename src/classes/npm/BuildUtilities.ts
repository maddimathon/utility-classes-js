/**
 * Utilities for building web projects with node scripts.
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

import NodeFS from 'node:fs';
// import NodePath from 'node:path';

import type { AbstractCoreOpts } from '../abstracts/AbstractCore.js';
import { AbstractCore, AbstractCoreOptsDefault } from '../abstracts/AbstractCore.js';

import type { FunctionTypes } from '../Functions.js';

import { NodeFunctions } from './NodeFunctions.js';
import type { NodeFunctionsOpts } from './NodeFunctions.js';

import type { PackageJson } from '../../types/jsonSchemas.js';



/** # TYPES
 ** ======================================================================== **/

/**
 * Adds a msg prop to the opts object, used for formatting progress messages.
 * @see BuildUtilities#progressMsg
 */
export type MsgObj = {
    msg: string;
} & Partial<FunctionTypes.MsgOpts>;

/**
 * For notices
 */
export type BuildStage =
    | "compile"
    | "build"
    | "dryrun"
    | "package";

/**
 * For premade messages
 */
export type NoticeStage =
    | `${ BuildStage }-start`
    | `${ BuildStage }-end`
    | "clean"
    | "minify"
    | "server-start"
    | "watch-start"
    | "watch-change-start"
    | "watch-change-end";

export type NoticeMsgOpts = {

    'msg'?: string;

    'watcher'?: string;
    'watch-no-change'?: boolean;

    'run-filename'?: string;

    'cleaning'?: string;
    'minifying'?: string;

} & Partial<FunctionTypes.MsgOpts>;

export type NoticeMsgReturn = Parameters<BuildUtilities[ '_progressMsgFormatter' ]>;

export type NoticeMsgFunction = ( opts: NoticeMsgOpts ) => NoticeMsgReturn;

/**
 * Options to pass the progress msg methods.
 */
export type NoticeMsgFunctionObjects = BuildUtilitiesOpts[ 'noticeMsgs' ];


/** ## Opts Interface ==================================== **/

/**
 * Options for instances of BuildUtilities.
 */
export interface BuildUtilitiesOpts extends AbstractCoreOpts {

    /**
     * Colour values to use for each build stage, by key.
     */
    stageColours: {
        [ K in BuildStage | "setup" | "start" | "watch" ]: keyof NodeFunctionsOpts[ 'ansiColours' ];
    };

    /**
     * Functions that return `MsgObj` objects for various build stages.
     */
    noticeMsgs: {
        [ K in NoticeStage ]: NoticeMsgFunction;
    };

    /**
     * Function that returns the string to use for folders/zips while packaging.
     */
    pkgName: ( pkg: PackageJson ) => string;

    /**
     * Paths to important files/dirs used by this class.
     */
    paths: {
        /**
         * Cache directory to use while building.
         */
        cacheDir: string;
        packageJson: string;
    };

    /**
     * Options to pass while constructing own instance if needed.
     */
    nodeUtilitiesOpts: NodeFunctionsOpts;

    noticeMsgOpts: NoticeMsgOpts;
}



/** # CLASS
 ** ======================================================================== **/

/**
 * General utility functions.
 * @requires NodeFunctions  Used for a variety of methods.
 */
export class BuildUtilities extends AbstractCore<BuildUtilitiesOpts> {

    public override get optsDefault(): BuildUtilitiesOpts {

        const stageStart = ( stage: BuildStage, opts: NoticeMsgOpts ): NoticeMsgReturn => {

            const startDate: Date = new Date();

            this.cacheSet( `${ stage }-start`, this.NF.timestamp( startDate ) );

            const msgObjs: MsgObj | MsgObj[] = (
                stage === 'dryrun'
                || stage === 'package'
            )
                ? [
                    { msg: `preparing ${ stage }... `, },
                    { msg: ` ${ this.pkg.name } `, flag: true, },
                    // { msg: ` @ `, flag: false, },
                    { msg: ` ${ this.pkg.version } `, clr: 'black', flag: true, },
                ]
                : { msg: `starting to ${ stage }...`, };

            return [
                msgObjs,
                {
                    clr: (
                        stage === 'dryrun'
                        || stage === 'package'
                    ) ? this.opts.stageColours.setup : this.opts.stageColours[ stage ],
                    bold: true,
                },
                startDate,
            ];
        };

        const stageEnd = ( stage: BuildStage, opts: NoticeMsgOpts ): NoticeMsgReturn => {

            const startCache = this.cacheGet( `${ stage }-start` );
            this.cacheDel( `${ stage }-start` );

            const msgObjs: MsgObj | MsgObj[] = (
                stage === 'dryrun'
                || stage === 'package'
            )
                ? [
                    { msg: `${ stage } finished `, },
                    { msg: ` ${ this.pkg.name } `, flag: true, },
                    { msg: ` ${ this.pkg.version } `, clr: 'black', flag: true, },
                ]
                : { msg: ` ${ stage } finished `, flag: true };

            return [
                msgObjs,
                {
                    clr: this.opts.stageColours[ stage ],
                    bold: true,
                },
                `${ startCache } – ${ this.NF.timestamp() }`,
            ];
        };

        return {
            ...AbstractCoreOptsDefault,

            stageColours: {
                compile: 'green',
                build: 'blue',
                watch: 'blue',
                start: 'turquoise',
                setup: 'yellow',
                dryrun: 'pink',
                package: 'purple',
            },

            noticeMsgs: {

                'build-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageStart( 'build', opts );
                },

                'build-end': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageEnd( 'build', opts );
                },

                'clean': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    const cleanMsg = opts.cleaning ? ` ${ opts.cleaning }` : ``;

                    return [
                        { msg: `cleaning${ cleanMsg }...`, },
                        {
                            clr: 'grey',
                            italic: true,
                            flag: false,
                        },
                    ];
                },

                'compile-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageStart( 'compile', opts );
                },

                'compile-end': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageEnd( 'compile', opts );
                },

                'dryrun-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageStart( 'dryrun', opts );
                },

                'dryrun-end': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageEnd( 'dryrun', opts );
                },

                'minify': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {

                    const minifyMsg = opts.minifying ? ` ${ opts.minifying }` : ``;

                    return [
                        { msg: `minifying${ minifyMsg }...`, },
                        {
                            clr: 'grey',
                            italic: true,
                            flag: false,
                        },
                    ];
                },

                'package-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageStart( 'package', opts );
                },

                'package-end': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    return stageEnd( 'package', opts );
                },

                'server-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {

                    return [
                        { msg: `starting server...` },
                        {
                            clr: this.opts.stageColours[ 'start' ],
                            bold: true,
                        },
                    ];
                },

                'watch-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {

                    return [
                        { msg: `starting to watch files...` },
                        {
                            clr: this.opts.stageColours[ 'watch' ],
                            bold: true,
                        },
                    ];
                },

                'watch-change-start': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    const startDate: Date = new Date();
                    const startWatcher = opts.watcher ?? '';

                    const noChange: boolean = opts[ 'watch-no-change' ] ?? false;

                    const clr = noChange ? 'grey' : this.opts.stageColours.watch;

                    let msgObjs: MsgObj[] = [];

                    if ( !noChange ) {

                        this.cacheSet(
                            `watch-change-start-${ this.NF.slugify( startWatcher ) }`,
                            this.NF.timestamp( startDate )
                        );
                    }

                    msgObjs.push( {
                        msg: noChange ? '👀 ' : '🚨 ',
                        italic: false,
                    } );

                    if ( startWatcher.length > 0 ) {

                        msgObjs.push( {
                            msg: ` ${ startWatcher } `,
                            flag: true,
                            italic: false,
                        } );
                    }

                    const filename = opts[ 'run-filename' ]
                        ? `(${ opts[ 'run-filename' ] }) `
                        : ``;

                    if ( noChange ) {

                        msgObjs.push( {
                            msg: ` no changes needed; file change ignored ${ filename }`,
                        } );
                    } else {

                        msgObjs.push( {
                            msg: ` file change detected ${ filename }`,
                            flag: startWatcher ? false : true,
                        } );
                    }

                    return [
                        msgObjs,
                        {
                            clr: clr,
                            italic: noChange ? true : false,
                            bold: noChange ? false : true,
                        },
                    ];
                },

                'watch-change-end': ( opts: NoticeMsgOpts ): NoticeMsgReturn => {
                    const endDate: Date = new Date();
                    const endWatcher = opts.watcher ?? '';

                    const watchChangeStartCache = this.cacheGet(
                        `watch-change-start-${ this.NF.slugify( endWatcher ) }`
                    );

                    this.cacheDel( `watch-change-start-${ this.NF.slugify( endWatcher ) }` );

                    let msgObjs: MsgObj[] = [];

                    msgObjs.push( {
                        msg: '✅ ',
                        bold: false,
                        italic: false,
                    } );

                    if ( endWatcher.length > 0 ) {

                        msgObjs.push( {
                            msg: ` ${ endWatcher } `,
                            flag: true,
                            italic: false,
                        } );
                    }

                    const filename = opts[ 'run-filename' ]
                        ? `(${ opts[ 'run-filename' ] }) `
                        : ``;

                    msgObjs.push( {
                        msg: ` file changes finished ${ filename }`,
                        flag: endWatcher ? false : true,
                    } );

                    return [
                        msgObjs,
                        {
                            clr: this.opts.stageColours.watch,
                            bold: false,
                            italic: true,
                        },
                        `${ watchChangeStartCache } – ${ this.NF.timestamp( endDate ) }`
                    ];
                },
            },

            pkgName: p => `${ p.name }@${ p.version }`,

            paths: {
                cacheDir: '.scripts/.cache',
                packageJson: './package.json',
            },

            noticeMsgOpts: {},

            nodeUtilitiesOpts: NodeFunctions.st.opts,
        };
    }

    /**
     * New version of this obj’s opts with given overrides.
     */
    protected override _getOpts( opts: Partial<BuildUtilitiesOpts> ): BuildUtilitiesOpts {

        let resultOpts: BuildUtilitiesOpts = super._getOpts( opts );

        resultOpts.nodeUtilitiesOpts = this.mergeArgs(
            resultOpts.nodeUtilitiesOpts,
            opts.nodeUtilitiesOpts ?? {},
            true
        );

        return resultOpts;
    }



    /** CONSTRUCTOR
     ** ==================================================================== **/

    constructor (
        opts: Partial<BuildUtilitiesOpts> = {},
        nodeUtilitiesInstance: NodeFunctions | undefined = undefined,
    ) {
        /* we’ll set the opts in a sec */
        super( opts );

        this.NF = nodeUtilitiesInstance ?? new NodeFunctions( this.opts.nodeUtilitiesOpts );
    }



    /** CACHING
     ** ==================================================================== **/

    /** 
     * Resolves subpath & returns absolute path in cache.
     * 
     * @param subPath  Relative to the cache directory set in opts.
     * 
     * @return  Absolute path.
     */
    protected _cachePath( subPath: string ): string {
        return this.NF.pathResolve( this.opts.paths.cacheDir, subPath );
    }

    /**
     * Writes information to a file in the cache directory.
     * 
     * @param name   Cache name to use.
     * @param value  Value to cache, as a string.
     * 
     * @return  Path to the cache or false on failure.
     */
    public cacheSet( name: string, value: string ): string | false {

        return this.NF.writeFile(
            this._cachePath( `${ name }.txt` ),
            value,
            { force: true, rename: false, }
        );
    }

    /**
     * Gets information from a file in the cache directory.
     * 
     * @param name  Cache name to get.
     * 
     * @return  Contents of the cache or null if none exists.
     */
    public cacheGet( name: string ): string | null {

        const path = this._cachePath( `${ name }.txt` );

        if ( !NodeFS.existsSync( path ) ) { return null; }

        return this.NF.readFile( path );
    }

    /**
     * @param name  Cache name to delete.
     */
    public cacheDel( name: string ): void {
        return this.NF.deleteFiles( this._cachePath( `${ name }.txt` ) );
    }



    /** META UTILITIES
     ** ==================================================================== **/

    /** Instance of the NodeFunctions class. */
    protected readonly NF: NodeFunctions;

    /** An object of the project’s pacakge.json file. */
    protected get pkg(): PackageJson {
        return JSON.parse( this.NF.readFile( this.opts.paths.packageJson ) );
    }



    /** PREFORMATTED VALUES
     ** ==================================================================== **/

    /** Uses the function at `this.opts.pkgName`. */
    public get pkgName() { return this.opts.pkgName( this.pkg ); }



    /** TERMINAL
     ** ==================================================================== **/

    /**
     * Returns a string formatted for terminal output as a
     * progress update while running build scripts.
     * 
     * @param _msg  Message(s) to include in the message, optionally with their own opts.
     * @param opts  Options to apply to the entire message.
     */
    protected _progressMsgFormatter(
        _msg: MsgObj | MsgObj[],
        opts: Partial<FunctionTypes.MsgOpts> = {},
        _time: Date | string | undefined = undefined,
    ): string {
        if ( !Array.isArray( _msg ) ) { _msg = [ _msg ]; }

        /**
         * Turn the msg into a single string
         */
        const msg: string = _msg.map( ( obj: MsgObj ) => {

            return this.NF.msg( obj.msg, {
                ...opts,
                ...obj,
            } );
        } ).join( '' );

        /**
         * Get the time string set up
         */
        if ( _time instanceof Date ) { _time = this.NF.timestamp( _time ); }
        const time: string = _time ?? this.NF.timestamp();

        /**
         * RETURN
         */
        const prefix: string = '[' + time + ']';
        return [
            this.NF.msg( prefix, { ...opts, italic: false, } ),
            this.NF.hangingIndent( msg, ' '.repeat( prefix.length ) ),
            // this.NF.msg( this.NF.hangingIndent( msg, this.NF.tab ), opts ),
        ].join( ' ' );
    }

    /**
     * Returns a terminal message for a specific compiling stage.
     */
    public progressMsg(
        stage: keyof NoticeMsgFunctionObjects | "test",
        noticeOpts: NoticeMsgOpts = {},
    ): string {

        if ( stage === 'test' ) {

            const stages = Object.keys(
                this.opts.noticeMsgs
            ) as NoticeStage[];

            const reqMsgOpts: Required<NoticeMsgOpts> = {
                msg: 'test progress message',
                watcher: 'test-watcher-name',
                'watch-no-change': false,
                'run-filename': 'test run-filename.js',
                cleaning: 'test cleaning notice',
                minifying: 'test minifying notice',

                clr: 'black',
                flag: false,
                bold: false,
                italic: false,
                indent: 0,
                leadInLines: 0,
                leadOutLines: 0,
            };

            const testNoticeMsgOpts = this.mergeArgs(
                reqMsgOpts,
                noticeOpts,
                true
            );

            return stages.map(
                ( stage ) => this.NF.msg( `- ${ stage }:`, {
                    italic: true,
                    leadInLines: 1,
                    leadOutLines: 1,
                } ) + this.progressMsg( stage, testNoticeMsgOpts )
            ).concat( [

                this.NF.msg( `- watch-change-start (no-change):`, {
                    italic: true,
                    leadInLines: 1,
                    leadOutLines: 1,
                } ) + this.progressMsg( 'watch-change-start', {
                    ...testNoticeMsgOpts,
                    'watch-no-change': true,
                } ),
            ] ).join( `\n` );
        }

        const fn: NoticeMsgFunctionObjects[ keyof NoticeMsgFunctionObjects ]
            = this.opts.noticeMsgs[ stage ];

        if ( typeof fn !== 'function' ) {
            return this._progressMsgFormatter(
                { msg: 'Error getting progressMsg for stage: ' + stage },
            );
        }

        return this._progressMsgFormatter( ...( fn( noticeOpts ) ) );
    }

    /**
     * Alias for `console.log( this.progressMsg() )`.
     */
    public progressLog(
        ...params: Parameters<BuildUtilities[ 'progressMsg' ]>
    ): void {
        return console.log( this.progressMsg( ...params ) );
    }
}