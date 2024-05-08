/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
import type { AbstractCoreOpts } from '../abstracts/AbstractCore.js';
import { AbstractCore } from '../abstracts/AbstractCore.js';
import type { FunctionTypes } from '../Functions.js';
import { NodeFunctions } from './NodeFunctions.js';
import type { NodeFunctionsOpts } from './NodeFunctions.js';
import type { PackageJson } from '../../types/jsonSchemas.js';
export type MsgObj = {
    msg: string;
} & Partial<FunctionTypes.MsgOpts>;
export type BuildStage = "compile" | "build" | "dryrun" | "package";
export type NoticeStage = `${ BuildStage }-start` | `${ BuildStage }-end` | "clean" | "minify" | "server-start" | "watch-start" | "watch-change-start" | "watch-change-end";
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
export type NoticeMsgFunctionObjects = BuildUtilitiesOpts[ 'noticeMsgs' ];
export interface BuildUtilitiesOpts extends AbstractCoreOpts {
    stageColours: {
        [ K in BuildStage | "setup" | "start" | "watch" ]: keyof NodeFunctionsOpts[ 'ansiColours' ];
    };
    noticeMsgs: {
        [ K in NoticeStage ]: NoticeMsgFunction;
    };
    pkgName: ( pkg: PackageJson ) => string;
    paths: {
        cacheDir: string;
        packageJson: string;
    };
    nodeUtilitiesOpts: NodeFunctionsOpts;
    noticeMsgOpts: NoticeMsgOpts;
}
export declare class BuildUtilities extends AbstractCore<BuildUtilitiesOpts> {
    get optsDefault(): BuildUtilitiesOpts;
    protected _getOpts( opts: Partial<BuildUtilitiesOpts> ): BuildUtilitiesOpts;
    constructor ( opts?: Partial<BuildUtilitiesOpts>, nodeUtilitiesInstance?: NodeFunctions | undefined );
    protected _cachePath( subPath: string ): string;
    cacheSet( name: string, value: string ): string | false;
    cacheGet( name: string ): string | null;
    cacheDel( name: string ): void;
    protected readonly NF: NodeFunctions;
    protected get pkg(): PackageJson;
    get pkgName(): string;
    protected _progressMsgFormatter( _msg: MsgObj | MsgObj[], opts?: Partial<FunctionTypes.MsgOpts>, _time?: Date | string | undefined ): string;
    progressMsg( stage: keyof NoticeMsgFunctionObjects | "test", noticeOpts?: NoticeMsgOpts ): string;
    progressLog( ...params: Parameters<BuildUtilities[ 'progressMsg' ]> ): void;
}
