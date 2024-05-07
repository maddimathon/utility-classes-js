/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */
interface AbstractCoreOpts {
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
declare const AbstractCoreOptsDefault: {
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
};
declare abstract class AbstractCore<Opts extends AbstractCoreOpts> {
    abstract get optsDefault(): Opts;
    protected opts: Opts;
    protected _getOpts(opts: Partial<Opts>): Opts;
    constructor(opts?: Partial<Opts>);
    protected typeOf(variable: any): "bigint" | "boolean" | "class" | "function" | "null" | "number" | "object" | "string" | "symbol" | "NaN" | "undefined";
    toString(): string;
    valueOf(): any;
    protected get tab(): string;
    protected escRegExp(convertMe: string): string;
    protected escRegExpReplace(convertMe: string): string;
    protected _combineArgs<D, I extends Partial<D>>(defaults: D, inputs: I | undefined, recursive: boolean, includeAllInputKeys: boolean): D;
    protected mergeArgs<D, I extends Partial<D>>(defaults: D, inputs: I | undefined, recursive?: boolean): D;
    protected parseArgs<D, I extends Partial<D>>(defaults: D, inputs: I | undefined, recursive?: boolean): D;
}
export type { AbstractCoreOpts, };
export { AbstractCoreOptsDefault, AbstractCore, };
