/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
import type { LangCode, LangLocaleCode } from '../types/strings.js';
import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore } from './abstracts/AbstractCore.js';
import type { VariableInspectorOpts } from './VariableInspector.js';
import { VariableInspector } from './VariableInspector.js';
export declare namespace FunctionTypes {
    type MsgOpts = {
        clr: keyof AbstractCoreOpts[ 'ansiColours' ] | false;
        flag: boolean;
        bold: boolean;
        italic: boolean;
        indent: number;
        leadInLines: number;
        leadOutLines: number;
    };
}
export interface FunctionsOpts extends AbstractCoreOpts {
    lang: LangCode | LangLocaleCode;
    formats: {
        date: Intl.DateTimeFormatOptions;
        datetime: Intl.DateTimeFormatOptions;
        time: Intl.DateTimeFormatOptions;
    };
    msgOpts: FunctionTypes.MsgOpts;
    varInspectorOpts: Partial<VariableInspectorOpts>;
}
export declare class Functions<Opts extends FunctionsOpts = FunctionsOpts> extends AbstractCore<Opts> {
    #private;
    static get st(): Functions;
    get optsDefault(): Opts;
    protected _getOpts( opts: Partial<Opts> ): Opts;
    constructor ( opts?: Partial<Opts> );
    escRegExp( ...params: Parameters<AbstractCore<Opts>[ 'escRegExp' ]> ): ReturnType<AbstractCore<Opts>[ 'escRegExp' ]>;
    escRegExpReplace( ...params: Parameters<AbstractCore<Opts>[ 'escRegExpReplace' ]> ): ReturnType<AbstractCore<Opts>[ 'escRegExpReplace' ]>;
    mergeArgs<D, I extends Partial<D>>( defaults: D, inputs: I | undefined, recursive?: boolean ): D;
    parseArgs<D, I extends Partial<D>>( defaults: D, inputs: I | undefined, recursive?: boolean ): D;
    typeOf( ...params: Parameters<AbstractCore<Opts>[ 'typeOf' ]> ): ReturnType<AbstractCore<Opts>[ 'typeOf' ]>;
    arrayRemove<I, A extends ( I | any )[]>( array: A, _itemsToRemove: I | I[] ): A;
    arrayUnique<I>( arr: I[] ): I[];
    hardTextWrap( text: string, width?: number, hangingIndent?: number ): string;
    hangingIndent( str: string, indent?: string ): string;
    slugify( convertMe: string ): string;
    toTitleCase( convertMe: string ): string;
    varInspect( variable: ConstructorParameters<typeof VariableInspector>[ 0 ], opts?: Partial<VariableInspectorOpts & FunctionTypes.MsgOpts> ): string;
    varDump( ...params: Parameters<Functions[ 'varInspect' ]> ): void;
    datestamp( date?: Date, language?: LangCode | LangLocaleCode | null, formatOpts?: Intl.DateTimeFormatOptions ): string;
    datetimestamp( date?: Date, language?: LangCode | LangLocaleCode | null, formatOpts?: Intl.DateTimeFormatOptions ): string;
    timestamp( date?: Date, language?: LangCode | LangLocaleCode | null, formatOpts?: Intl.DateTimeFormatOptions ): string;
    log( _msg: string, _opts?: Partial<FunctionTypes.MsgOpts> ): void;
    msg( _msg: string, _opts?: Partial<FunctionTypes.MsgOpts> ): string;
    timestampLog( ...params: Parameters<Functions[ 'timestampMsg' ]> ): void;
    timestampMsg( msg: string, _opts?: Partial<FunctionTypes.MsgOpts>, date?: Date | undefined ): string;
    timestampVarDump( ...params: Parameters<Functions[ 'timestampVarInspect' ]> ): void;
    timestampVarInspect( variable: ConstructorParameters<typeof VariableInspector>[ 0 ], opts?: Partial<VariableInspectorOpts & FunctionTypes.MsgOpts> ): string;
}
