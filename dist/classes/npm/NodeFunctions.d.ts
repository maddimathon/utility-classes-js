/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { WriteFileOptions } from 'node:fs';
import type { GlobOptions } from 'glob';
import type { BoilerFilesOpts, BoilerFileMethodKey } from '../BoilerFiles.js';
import { BoilerFiles } from '../BoilerFiles.js';
import type { FunctionsOpts } from '../Functions.js';
import { Functions } from '../Functions.js';
export declare namespace NodeFunctionTypes {
    type CopyFilesOpts = {
        ignoreGlobs: string[];
        includeDefaultIgnoreGlobs: boolean;
    };
    type ReadFileOpts = {
        encoding: BufferEncoding;
        flag: string | undefined;
    };
    type WriteFileOpts = {
        force: boolean;
        rename: boolean;
        opts: WriteFileOptions;
    };
}
export interface NodeFunctionsOpts extends FunctionsOpts {
    root: string;
    copyFilesOpts: NodeFunctionTypes.CopyFilesOpts;
    globOpts: GlobOptions;
    readFileOpts: NodeFunctionTypes.ReadFileOpts;
    writeFileOpts: NodeFunctionTypes.WriteFileOpts;
    ignoreGlobs: string[];
    boilerFilesOpts: Partial<BoilerFilesOpts>;
}
export declare class NodeFunctions extends Functions<NodeFunctionsOpts> {
    #private;
    static get st(): NodeFunctions;
    get optsDefault(): NodeFunctionsOpts;
    protected _getOpts( opts: Partial<NodeFunctionsOpts> ): NodeFunctionsOpts;
    constructor ( opts?: Partial<NodeFunctionsOpts> );
    pathRelative( path: string ): string;
    pathResolve( ...paths: string[] ): string;
    glob( globs: string | string[], opts?: GlobOptions, relative?: boolean ): string[];
    protected _changeBaseName( path: string, newName: string ): string;
    protected _uniquePath( _path: string ): string;
    deleteFiles( glob: string | string[], globOpts?: GlobOptions ): void;
    copyFiles( _glob: string | string[], _destination: string, _source?: string, _opts?: Partial<NodeFunctionTypes.CopyFilesOpts> ): void;
    readFile( _path: string, _opts?: Partial<NodeFunctionTypes.ReadFileOpts> ): string;
    writeFile( _path: string, _content: string | string[], _opts?: Partial<NodeFunctionTypes.WriteFileOpts> ): string | false;
    protected readonly _BF: BoilerFiles;
    getBoilerFile<M extends BoilerFileMethodKey>( method: M, ...params: Parameters<typeof this._BF[ M ]> ): import( "../../types/jsonSchemas.js" ).TsConfig;
    writeBoilerFile( destination: string, ...params: Parameters<NodeFunctions[ 'getBoilerFile' ]> ): ReturnType<NodeFunctions[ 'writeFile' ]>;
}
