/**
 * A version of the Functions class optimized and extended for use with node,
 * especially scripting.
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
import type { WriteFileOptions } from 'node:fs';

import NodePath from 'node:path';

import { globSync } from 'glob';
import type { GlobOptions } from 'glob';

import type { BoilerFilesOpts, BoilerFileMethodKey } from '../BoilerFiles.js';
import { BoilerFiles } from '../BoilerFiles.js';

// import type { VariableInspectorOpts } from '../VariableInspector.js';
// import { VariableInspector } from '../VariableInspector.js';

import type { FunctionsOpts } from '../Functions.js';
import { Functions } from '../Functions.js';



/** # TYPES
 ** ======================================================================== **/

export namespace NodeFunctionTypes {

    /**
     * Default options for `copyFiles()`.
     */
    export type CopyFilesOpts = {

        /** Default globs to ignore when dealing with files. */
        ignoreGlobs: string[],

        /** Whether to include the default ignoreGlobs. */
        includeDefaultIgnoreGlobs: boolean,
    };

    export type ReadFileOpts = {
        encoding: BufferEncoding;
        flag: string | undefined;
    };

    /**
     * Default options for `writeFile()`.
     */
    export type WriteFileOpts = {

        /** Overwrite file at destination if it exists. */
        force: boolean,

        /** If a file exists at destination, append a number to the file’s basename so it’s unique. */
        rename: boolean,

        /** Value to pass to the node write file function. */
        opts: WriteFileOptions,
    };
}


/** ## Opts Interface ==================================== **/

/**
 * Options for instances of the NodeFunctions class.
 */
export interface NodeFunctionsOpts extends FunctionsOpts {

    /**
     * Absolute path to the root directory to use for relative paths.
     */
    root: string, // Absolute path to the root directory to use for relative paths.

    copyFilesOpts: NodeFunctionTypes.CopyFilesOpts,

    globOpts: GlobOptions,

    readFileOpts: NodeFunctionTypes.ReadFileOpts,

    writeFileOpts: NodeFunctionTypes.WriteFileOpts,

    /**
     * Default globs to ignore when dealing with files.
     */
    ignoreGlobs: string[], // Default globs to ignore when dealing with files.

    boilerFilesOpts: Partial<BoilerFilesOpts>,
};



/** # CLASS
 ** ======================================================================== **/

/**
 * General utility functions extended for use within node.
 * 
 * @requires module:glob        NPM package used for working with files.
 * @requires VariableInspector  Dependency for this class’ `varInspect()` & `varDump()` methods.
 */
export class NodeFunctions extends Functions<NodeFunctionsOpts> {

    /** 
     * Use the functions without configuration (alternative to 
     * making all methods static).
     */
    static #static: NodeFunctions;

    /**
     * Use the functions without configuration.
     */
    public static override get st(): NodeFunctions {

        if ( typeof NodeFunctions.#static === 'undefined' ) {
            NodeFunctions.#static = new NodeFunctions();
        }
        return NodeFunctions.#static;
    }



    /** LOCAL
     ** ==================================================================== **/

    public override get optsDefault(): NodeFunctionsOpts {

        return {
            ...super.optsDefault,

            root: NodePath.resolve( './' ),

            copyFilesOpts: {
                ignoreGlobs: [],
                includeDefaultIgnoreGlobs: true,
            },

            globOpts: {
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
            },

            readFileOpts: {
                encoding: 'utf-8',
                flag: undefined,
            },

            writeFileOpts: {
                force: false,
                rename: false,
                opts: {
                    encoding: 'utf-8',
                },
            },

            ignoreGlobs: [
                '**/._*',
                '**/._**/**/*',
                '**/.DS_STORE',
                '**/.smbdelete*',
            ],

            boilerFilesOpts: {},
        };
    }

    /**
     * New version of this obj’s opts with given overrides.
     */
    protected override _getOpts( opts: Partial<NodeFunctionsOpts> ): NodeFunctionsOpts {

        let resultOpts: NodeFunctionsOpts = super._getOpts( opts );

        resultOpts.globOpts = this.mergeArgs(
            resultOpts.globOpts,
            opts.globOpts ?? {},
            true
        );

        resultOpts.readFileOpts = this.mergeArgs(
            resultOpts.readFileOpts,
            opts.readFileOpts ?? {},
            true
        );

        resultOpts.writeFileOpts.opts = this.mergeArgs(
            resultOpts.writeFileOpts.opts,
            opts.writeFileOpts?.opts ?? {},
            true
        );

        resultOpts.boilerFilesOpts = this.mergeArgs(
            resultOpts.boilerFilesOpts,
            opts.boilerFilesOpts ?? {},
            true
        );

        resultOpts.globOpts.withFileTypes = false;

        return resultOpts;
    }



    /** CONSTRUCTOR
     ** ==================================================================== **/

    constructor ( opts: Partial<NodeFunctionsOpts> = {} ) {
        super( opts );

        this._BF = new BoilerFiles( this.opts.boilerFilesOpts );
    }



    /** ALIASES
     ** Internal aliases or shortcuts for preexisting functions/modules.
     ** ==================================================================== **/


    /** NodePath ==================================== **/

    /**
     * Returns relative paths, based on the root defined the the opts.
     * 
     * @param path  Path to make relative. Passed through this.pathResolve() first.
     */
    public pathRelative( path: string ): string {
        return NodePath.relative( this.pathResolve(), this.pathResolve( path ) );
    }

    /**
     * Resolves relative to the root defined the the opts.
     */
    public pathResolve( ...paths: string[] ): string {
        return NodePath.resolve( this.opts.root, ...paths );
    }



    /** WORKING WITH FILES & PATHS
     ** ==================================================================== **/

    /**
     * Alias for `globSync()`.
     * 
     * @param relative  Whether relative paths should be returned.
     */
    public glob(
        globs: string | string[],
        opts: GlobOptions = {},
        relative: boolean = false,
    ): string[] {

        const globResult = globSync( globs, this.mergeArgs(
            this.opts.globOpts,
            opts,
            false
        ) ) as string | string[];

        const filepaths: string[] = (
            Array.isArray( globResult )
                ? globResult
                : [ globResult ]
        ).sort();

        return relative ? filepaths.map(
            ( path ) => this.pathRelative( path )
        ) : filepaths;
    }


    /** PRIVATE ==================================== **/

    /**
     * Changes just the file name of a path
     * 
     * @param path     
     * @param newName  
     * 
     * @return  Full path with updated basename.
     */
    protected _changeBaseName(
        path: string,
        newName: string
    ): string {

        return this.pathResolve(
            NodePath.dirname( path ),
            newName
        );
    }

    /**
     * Returns a unique version of the inputPath (i.e., where no file exists) by
     * appending a number.
     *
     * @return  A unique version of the given inputPath.
     */
    protected _uniquePath( _path: string ): string {
        if ( !NodeFS.existsSync( _path ) ) { return _path; }
        const inputPath: typeof _path = _path;

        /** @var pathExtension  This file’s extension. */
        const pathExtension: string = NodePath.extname( inputPath );

        /** @var copyIndex  Copy index - a number to append to OG name */
        let copyIndex = 1;

        /** @var uniqueFileName */
        let uniqueFileName = NodePath.basename(
            inputPath,
            pathExtension || undefined
        ) + `-${ copyIndex }${ pathExtension }`;

        /** 
         * Iterate the index until the inputPath is unique
         */
        while ( NodeFS.existsSync(
            this._changeBaseName( inputPath, uniqueFileName )
        ) ) {

            uniqueFileName = uniqueFileName.replace(
                new RegExp(
                    `-${ copyIndex }${ this.escRegExp( pathExtension ) }$`,
                    'gi'
                ),
                `-${ copyIndex + 1 }${ this.escRegExpReplace( pathExtension ) }`
            );
            copyIndex++;
        }

        /** RETURN **/
        return this._changeBaseName( inputPath, uniqueFileName );
    }


    /** PUBLIC ==================================== **/

    /**
     * Deletes globbed files.
     * 
     * @param glob      
     * @param globOpts  
     */
    public deleteFiles(
        glob: string | string[],
        globOpts: GlobOptions = {},
    ): void {

        const paths = this.glob( glob, globOpts, false );

        for ( const path of paths ) {

            const stat = NodeFS.statSync( path );

            if ( stat.isDirectory() ) {

                NodeFS.rmSync( path, { recursive: true, force: true } );

            } else if ( stat.isFile() || stat.isSymbolicLink() ) {

                NodeFS.unlinkSync( path );
            }
        }
    }

    /**
     * Copies globbedFiles from one directory to another.
     * 
     * @param _glob         
     * @param _destination  Destination directory.
     * @param _source       Source directory.
     * @param _opts         
     */
    public copyFiles(
        _glob: string | string[],
        _destination: string,
        _source: string = this.opts.root,
        _opts: Partial<NodeFunctionTypes.CopyFilesOpts> = {}
    ): void {
        if ( !Array.isArray( _glob ) ) { _glob = [ _glob ]; }

        // I prefer them as constants
        const [ glob, destination, source ] = [ _glob, _destination, _source ];

        const opts: NodeFunctionTypes.CopyFilesOpts = this.parseArgs(
            this.opts.copyFilesOpts,
            _opts
        );

        /** 
         * Resolved versions of the directory paths with trailing slashes.
         */
        const resolved = {
            destination: this.pathResolve( destination ).replace( /\/*$/gi, '/' ),
            source: this.pathResolve( source ).replace( /\/*$/gi, '/' ),
        };

        const ignoreGlobs: string[] = opts.includeDefaultIgnoreGlobs ? [
            ...this.opts.ignoreGlobs,
            ...opts.ignoreGlobs,
        ] : opts.ignoreGlobs;

        // Uses NodePath because the resolved paths have already gone through this.pathResolve()
        const globbedFiles: string[] = this.glob(
            glob.map( g => NodePath.resolve( resolved.source, g ) ),
            {
                ignore: ignoreGlobs.map( g => NodePath.resolve( resolved.source, g ) ),
            }
        );

        // const ignoreFiles = this.glob( opts.ignoreGlobs, { root: resolved.source, ignore: [], } );

        /**
         * Write the files.
         */
        for ( const file of globbedFiles ) {
            // if ( ignoreFiles.includes( file ) ) { continue; }

            const destFile = file
                .replace(
                    new RegExp( '^' + this.escRegExp( resolved.source ), 'gi' ),
                    this.escRegExpReplace( resolved.destination )
                )
                .replace( /\/+$/gi, '' );

            const destDirectory = NodePath.dirname( destFile );

            const stats = NodeFS.statSync( file );

            if ( stats.isDirectory() ) {

                NodeFS.mkdirSync( destDirectory, { recursive: true } );
                // this.copyFiles(
                //     '*',
                //     destFile,
                //     file,
                // );

            } else {
                NodeFS.mkdirSync( destDirectory, { recursive: true } );
                NodeFS.copyFileSync( file, destFile );
            }
        }
    }

    /**
     * Writes a file.
     * 
     * @param _path     
     * @param _content  
     * @param _opts     
     * 
     * @return  Path to file if written, or false on failure.
     */
    public readFile(
        _path: string,
        _opts: Partial<NodeFunctionTypes.ReadFileOpts> = {},
    ): string {
        const path = _path;
        const opts = this.mergeArgs( this.opts.readFileOpts, _opts, true );

        /**
         * RETURN
         */
        return NodeFS.readFileSync( this.pathResolve( path ), opts );
    }

    /**
     * Writes a file.
     * 
     * @param _path     
     * @param _content  
     * @param _opts     
     * 
     * @return  Path to file if written, or false on failure.
     */
    public writeFile(
        _path: string,
        _content: string | string[],
        _opts: Partial<NodeFunctionTypes.WriteFileOpts> = {},
    ): string | false {

        const content = Array.isArray( _content )
            ? _content.join( `\n` )
            : _content;

        const opts = this.parseArgs( this.opts.writeFileOpts, _opts, true );

        const path = !opts.force && opts.rename
            ? this._uniquePath( this.pathResolve( _path ) )
            : this.pathResolve( _path );

        /**
         * Write the file
         */
        if ( !opts.force && NodeFS.existsSync( path ) ) { return false; }

        NodeFS.mkdirSync( NodePath.dirname( path ), { recursive: true } );

        NodeFS.writeFileSync(
            this.pathResolve( path ),
            content,
            opts.opts
        );

        /**
         * RETURN
         */
        return NodeFS.existsSync( path ) ? path : false;
    }



    /** BOILER FILES
     ** ==================================================================== **/

    protected readonly _BF: BoilerFiles;

    /**
     * Alias for BoilerFiles class.
     */
    public getBoilerFile<M extends BoilerFileMethodKey>(
        method: M,
        ...params: Parameters<typeof this._BF[ M ]>
    ) {
        // TODO - figure out how to type the params argument
        //@ts-expect-error
        return this._BF[ method ]( ...params );
    }

    /**
     * Writes a file from BoilerFiles to given destination.
     */
    public writeBoilerFile(
        destination: string,
        ...params: Parameters<NodeFunctions[ 'getBoilerFile' ]>
    ): ReturnType<NodeFunctions[ 'writeFile' ]> {

        const file = this.getBoilerFile( ...params );

        return this.writeFile(
            destination,
            JSON.stringify( file, null, this.opts.tabWidth ),
            { force: true, }
        );
    };
}