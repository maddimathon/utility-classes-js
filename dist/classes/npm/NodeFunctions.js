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
var _a, _NodeFunctions_static;
import NodeFS from 'node:fs';
import NodePath from 'node:path';
import { globSync } from 'glob';
import { BoilerFiles } from '../BoilerFiles.js';
import { Functions } from '../Functions.js';
;
export class NodeFunctions extends Functions {
    static get st() {
        if ( typeof __classPrivateFieldGet( _a, _a, "f", _NodeFunctions_static ) === 'undefined' ) {
            __classPrivateFieldSet( _a, _a, new _a(), "f", _NodeFunctions_static );
        }
        return __classPrivateFieldGet( _a, _a, "f", _NodeFunctions_static );
    }
    get optsDefault() {
        return Object.assign( Object.assign( {}, super.optsDefault ), {
            root: NodePath.resolve( './' ), copyFilesOpts: {
                ignoreGlobs: [],
                includeDefaultIgnoreGlobs: true,
            }, globOpts: {
                absolute: true,
                dot: true,
                ignore: [
                    '**/._*',
                    '**/._*/**/*',
                    '**/.DS_STORE',
                    '**/.smbdelete*',
                    '**/.smbdelete*/**/*',
                ],
                realpath: true,
            }, readFileOpts: {
                encoding: 'utf-8',
                flag: undefined,
            }, writeFileOpts: {
                force: false,
                rename: false,
                opts: {
                    encoding: 'utf-8',
                },
            }, ignoreGlobs: [
                '**/._*',
                '**/._**/**/*',
                '**/.DS_STORE',
                '**/.smbdelete*',
            ], boilerFilesOpts: {}
        } );
    }
    _getOpts( opts ) {
        var _b, _c, _d, _e, _f;
        let resultOpts = super._getOpts( opts );
        resultOpts.globOpts = this.mergeArgs( resultOpts.globOpts, ( _b = opts.globOpts ) !== null && _b !== void 0 ? _b : {}, true );
        resultOpts.readFileOpts = this.mergeArgs( resultOpts.readFileOpts, ( _c = opts.readFileOpts ) !== null && _c !== void 0 ? _c : {}, true );
        resultOpts.writeFileOpts.opts = this.mergeArgs( resultOpts.writeFileOpts.opts, ( _e = ( _d = opts.writeFileOpts ) === null || _d === void 0 ? void 0 : _d.opts ) !== null && _e !== void 0 ? _e : {}, true );
        resultOpts.boilerFilesOpts = this.mergeArgs( resultOpts.boilerFilesOpts, ( _f = opts.boilerFilesOpts ) !== null && _f !== void 0 ? _f : {}, true );
        resultOpts.globOpts.withFileTypes = false;
        return resultOpts;
    }
    constructor ( opts = {} ) {
        super( opts );
        this._BF = new BoilerFiles( this.opts.boilerFilesOpts );
    }
    pathRelative( path ) {
        return NodePath.relative( this.pathResolve(), this.pathResolve( path ) );
    }
    pathResolve( ...paths ) {
        return NodePath.resolve( this.opts.root, ...paths );
    }
    glob( globs, opts = {}, relative = false ) {
        const globResult = globSync( globs, this.mergeArgs( this.opts.globOpts, opts, false ) );
        const filepaths = ( Array.isArray( globResult )
            ? globResult
            : [ globResult ] ).sort();
        return relative ? filepaths.map( ( path ) => this.pathRelative( path ) ) : filepaths;
    }
    _changeBaseName( path, newName ) {
        return this.pathResolve( NodePath.dirname( path ), newName );
    }
    _uniquePath( _path ) {
        if ( !NodeFS.existsSync( _path ) ) {
            return _path;
        }
        const inputPath = _path;
        const pathExtension = NodePath.extname( inputPath );
        let copyIndex = 1;
        let uniqueFileName = NodePath.basename( inputPath, pathExtension || undefined ) + `-${ copyIndex }${ pathExtension }`;
        while ( NodeFS.existsSync( this._changeBaseName( inputPath, uniqueFileName ) ) ) {
            uniqueFileName = uniqueFileName.replace( new RegExp( `-${ copyIndex }${ this.escRegExp( pathExtension ) }$`, 'gi' ), `-${ copyIndex + 1 }${ this.escRegExpReplace( pathExtension ) }` );
            copyIndex++;
        }
        return this._changeBaseName( inputPath, uniqueFileName );
    }
    deleteFiles( glob, globOpts = {} ) {
        const paths = this.glob( glob, globOpts, false );
        for ( const path of paths ) {
            const stat = NodeFS.statSync( path );
            if ( stat.isDirectory() ) {
                NodeFS.rmSync( path, { recursive: true, force: true } );
            }
            else if ( stat.isFile() || stat.isSymbolicLink() ) {
                NodeFS.unlinkSync( path );
            }
        }
    }
    copyFiles( _glob, _destination, _source = this.opts.root, _opts = {} ) {
        if ( !Array.isArray( _glob ) ) {
            _glob = [ _glob ];
        }
        const [ glob, destination, source ] = [ _glob, _destination, _source ];
        const opts = this.parseArgs( this.opts.copyFilesOpts, _opts );
        const resolved = {
            destination: this.pathResolve( destination ).replace( /\/*$/gi, '/' ),
            source: this.pathResolve( source ).replace( /\/*$/gi, '/' ),
        };
        const ignoreGlobs = opts.includeDefaultIgnoreGlobs ? [
            ...this.opts.ignoreGlobs,
            ...opts.ignoreGlobs,
        ] : opts.ignoreGlobs;
        const globbedFiles = this.glob( glob.map( g => NodePath.resolve( resolved.source, g ) ), {
            ignore: ignoreGlobs.map( g => NodePath.resolve( resolved.source, g ) ),
        } );
        for ( const file of globbedFiles ) {
            const destFile = file
                .replace( new RegExp( '^' + this.escRegExp( resolved.source ), 'gi' ), this.escRegExpReplace( resolved.destination ) )
                .replace( /\/+$/gi, '' );
            const destDirectory = NodePath.dirname( destFile );
            const stats = NodeFS.statSync( file );
            if ( stats.isDirectory() ) {
                NodeFS.mkdirSync( destDirectory, { recursive: true } );
            }
            else {
                NodeFS.mkdirSync( destDirectory, { recursive: true } );
                NodeFS.copyFileSync( file, destFile );
            }
        }
    }
    readFile( _path, _opts = {} ) {
        const path = _path;
        const opts = this.mergeArgs( this.opts.readFileOpts, _opts, true );
        return NodeFS.readFileSync( this.pathResolve( path ), opts );
    }
    writeFile( _path, _content, _opts = {} ) {
        const content = Array.isArray( _content )
            ? _content.join( `\n` )
            : _content;
        const opts = this.parseArgs( this.opts.writeFileOpts, _opts, true );
        const path = !opts.force && opts.rename
            ? this._uniquePath( this.pathResolve( _path ) )
            : this.pathResolve( _path );
        if ( !opts.force && NodeFS.existsSync( path ) ) {
            return false;
        }
        NodeFS.mkdirSync( NodePath.dirname( path ), { recursive: true } );
        NodeFS.writeFileSync( this.pathResolve( path ), content, opts.opts );
        return NodeFS.existsSync( path ) ? path : false;
    }
    getBoilerFile( method, ...params ) {
        return this._BF[ method ]( ...params );
    }
    writeBoilerFile( destination, ...params ) {
        const file = this.getBoilerFile( ...params );
        return this.writeFile( destination, JSON.stringify( file, null, this.opts.tabWidth ), { force: true, } );
    }
    ;
}
_a = NodeFunctions;
_NodeFunctions_static = { value: void 0 };
