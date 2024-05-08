/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
import NodeFS from 'node:fs';
import { AbstractCore, AbstractCoreOptsDefault } from '../abstracts/AbstractCore.js';
import { NodeFunctions } from './NodeFunctions.js';
export class BuildUtilities extends AbstractCore {
    get optsDefault() {
        const stageStart = ( stage, opts ) => {
            const startDate = new Date();
            this.cacheSet( `${ stage }-start`, this.NF.timestamp( startDate ) );
            const msgObjs = ( stage === 'dryrun'
                || stage === 'package' )
                ? [
                    { msg: `preparing ${ stage }... `, },
                    { msg: ` ${ this.pkg.name } `, flag: true, },
                    { msg: ` ${ this.pkg.version } `, clr: 'black', flag: true, },
                ]
                : { msg: `starting to ${ stage }...`, };
            return [
                msgObjs,
                {
                    clr: ( stage === 'dryrun'
                        || stage === 'package' ) ? this.opts.stageColours.setup : this.opts.stageColours[ stage ],
                    bold: true,
                },
                startDate,
            ];
        };
        const stageEnd = ( stage, opts ) => {
            const startCache = this.cacheGet( `${ stage }-start` );
            this.cacheDel( `${ stage }-start` );
            const msgObjs = ( stage === 'dryrun'
                || stage === 'package' )
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
        return Object.assign( Object.assign( {}, AbstractCoreOptsDefault ), {
            stageColours: {
                compile: 'green',
                build: 'blue',
                watch: 'blue',
                start: 'turquoise',
                setup: 'yellow',
                dryrun: 'pink',
                package: 'purple',
            }, noticeMsgs: {
                'build-start': ( opts ) => {
                    return stageStart( 'build', opts );
                },
                'build-end': ( opts ) => {
                    return stageEnd( 'build', opts );
                },
                'clean': ( opts ) => {
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
                'compile-start': ( opts ) => {
                    return stageStart( 'compile', opts );
                },
                'compile-end': ( opts ) => {
                    return stageEnd( 'compile', opts );
                },
                'dryrun-start': ( opts ) => {
                    return stageStart( 'dryrun', opts );
                },
                'dryrun-end': ( opts ) => {
                    return stageEnd( 'dryrun', opts );
                },
                'minify': ( opts ) => {
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
                'package-start': ( opts ) => {
                    return stageStart( 'package', opts );
                },
                'package-end': ( opts ) => {
                    return stageEnd( 'package', opts );
                },
                'server-start': ( opts ) => {
                    return [
                        { msg: `starting server...` },
                        {
                            clr: this.opts.stageColours[ 'start' ],
                            bold: true,
                        },
                    ];
                },
                'watch-start': ( opts ) => {
                    return [
                        { msg: `starting to watch files...` },
                        {
                            clr: this.opts.stageColours[ 'watch' ],
                            bold: true,
                        },
                    ];
                },
                'watch-change-start': ( opts ) => {
                    var _a, _b;
                    const startDate = new Date();
                    const startWatcher = ( _a = opts.watcher ) !== null && _a !== void 0 ? _a : '';
                    const noChange = ( _b = opts[ 'watch-no-change' ] ) !== null && _b !== void 0 ? _b : false;
                    const clr = noChange ? 'grey' : this.opts.stageColours.watch;
                    let msgObjs = [];
                    if ( !noChange ) {
                        this.cacheSet( `watch-change-start-${ this.NF.slugify( startWatcher ) }`, this.NF.timestamp( startDate ) );
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
                    }
                    else {
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
                'watch-change-end': ( opts ) => {
                    var _a;
                    const endDate = new Date();
                    const endWatcher = ( _a = opts.watcher ) !== null && _a !== void 0 ? _a : '';
                    const watchChangeStartCache = this.cacheGet( `watch-change-start-${ this.NF.slugify( endWatcher ) }` );
                    this.cacheDel( `watch-change-start-${ this.NF.slugify( endWatcher ) }` );
                    let msgObjs = [];
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
            }, pkgName: p => `${ p.name }@${ p.version }`, paths: {
                cacheDir: '.scripts/.cache',
                packageJson: './package.json',
            }, noticeMsgOpts: {}, nodeUtilitiesOpts: NodeFunctions.st.opts
        } );
    }
    _getOpts( opts ) {
        var _a;
        let resultOpts = super._getOpts( opts );
        resultOpts.nodeUtilitiesOpts = this.mergeArgs( resultOpts.nodeUtilitiesOpts, ( _a = opts.nodeUtilitiesOpts ) !== null && _a !== void 0 ? _a : {}, true );
        return resultOpts;
    }
    constructor ( opts = {}, nodeUtilitiesInstance = undefined ) {
        super( opts );
        this.NF = nodeUtilitiesInstance !== null && nodeUtilitiesInstance !== void 0 ? nodeUtilitiesInstance : new NodeFunctions( this.opts.nodeUtilitiesOpts );
    }
    _cachePath( subPath ) {
        return this.NF.pathResolve( this.opts.paths.cacheDir, subPath );
    }
    cacheSet( name, value ) {
        return this.NF.writeFile( this._cachePath( `${ name }.txt` ), value, { force: true, rename: false, } );
    }
    cacheGet( name ) {
        const path = this._cachePath( `${ name }.txt` );
        if ( !NodeFS.existsSync( path ) ) {
            return null;
        }
        return this.NF.readFile( path );
    }
    cacheDel( name ) {
        return this.NF.deleteFiles( this._cachePath( `${ name }.txt` ) );
    }
    get pkg() {
        return JSON.parse( this.NF.readFile( this.opts.paths.packageJson ) );
    }
    get pkgName() { return this.opts.pkgName( this.pkg ); }
    _progressMsgFormatter( _msg, opts = {}, _time = undefined ) {
        if ( !Array.isArray( _msg ) ) {
            _msg = [ _msg ];
        }
        const msg = _msg.map( ( obj ) => {
            return this.NF.msg( obj.msg, Object.assign( Object.assign( {}, opts ), obj ) );
        } ).join( '' );
        if ( _time instanceof Date ) {
            _time = this.NF.timestamp( _time );
        }
        const time = _time !== null && _time !== void 0 ? _time : this.NF.timestamp();
        const prefix = '[' + time + ']';
        return [
            this.NF.msg( prefix, Object.assign( Object.assign( {}, opts ), { italic: false } ) ),
            this.NF.hangingIndent( msg, ' '.repeat( prefix.length ) ),
        ].join( ' ' );
    }
    progressMsg( stage, noticeOpts = {} ) {
        if ( stage === 'test' ) {
            const stages = Object.keys( this.opts.noticeMsgs );
            const reqMsgOpts = {
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
            const testNoticeMsgOpts = this.mergeArgs( reqMsgOpts, noticeOpts, true );
            return stages.map( ( stage ) => this.NF.msg( `- ${ stage }:`, {
                italic: true,
                leadInLines: 1,
                leadOutLines: 1,
            } ) + this.progressMsg( stage, testNoticeMsgOpts ) ).concat( [
                this.NF.msg( `- watch-change-start (no-change):`, {
                    italic: true,
                    leadInLines: 1,
                    leadOutLines: 1,
                } ) + this.progressMsg( 'watch-change-start', Object.assign( Object.assign( {}, testNoticeMsgOpts ), { 'watch-no-change': true } ) ),
            ] ).join( `\n` );
        }
        const fn = this.opts.noticeMsgs[ stage ];
        if ( typeof fn !== 'function' ) {
            return this._progressMsgFormatter( { msg: 'Error getting progressMsg for stage: ' + stage } );
        }
        return this._progressMsgFormatter( ...( fn( noticeOpts ) ) );
    }
    progressLog( ...params ) {
        return console.log( this.progressMsg( ...params ) );
    }
}
