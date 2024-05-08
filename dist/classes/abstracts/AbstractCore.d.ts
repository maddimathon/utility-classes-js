/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
export interface AbstractCoreOpts {
    tabWidth: number;
    tabCharacter: string;
    ansiEscape: string;
    ansiColours: {
        red: string;
        orange: string;
        yellow: string;
        green: string;
        turquoise: string;
        blue: string;
        purple: string;
        pink: string;
        grey: string;
        white: string;
        black: string;
    };
}
export declare const AbstractCoreOptsDefault: AbstractCoreOpts;
export declare abstract class AbstractCore<Opts extends AbstractCoreOpts> {
    abstract get optsDefault(): Opts;
    opts: Opts;
    protected _getOpts( opts: Partial<Opts> ): Opts;
    constructor ( opts?: Partial<Opts> );
    protected typeOf( variable: any ): "bigint" | "boolean" | "class" | "function" | "null" | "number" | "object" | "string" | "symbol" | "NaN" | "undefined";
    toString(): string;
    protected get tab(): string;
    protected escRegExp( convertMe: string ): string;
    protected escRegExpReplace( convertMe: string ): string;
    protected _combineArgs<D, I extends Partial<D>>( defaults: D, inputs: I | undefined, recursive: boolean, includeAllInputKeys: boolean ): D;
    protected mergeArgs<D, I extends Partial<D>>( defaults: D, inputs: I | undefined, recursive?: boolean ): D;
    protected parseArgs<D, I extends Partial<D>>( defaults: D, inputs: I | undefined, recursive?: boolean ): D;
}
