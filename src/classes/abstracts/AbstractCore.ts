/**
 * General utility functions that I hope to be near-universally useful when
 * writing javascript.
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



/** # TYPES
 ** ======================================================================== **/

export interface AbstractCoreOpts {

    tabWidth: number;
    tabCharacter: string;

    ansiEscape: string;

    /**
     * Colour codes that I like for each colour.
     */
    ansiColours: {
        red: string,
        orange: string,
        yellow: string,
        green: string,
        turquoise: string,
        blue: string,
        purple: string,
        pink: string,
        grey: string,

        white: string,
        black: string,
    };
};



/** # VARIABLES
 ** ======================================================================== **/

export const AbstractCoreOptsDefault: AbstractCoreOpts = {
    tabWidth: 4,
    tabCharacter: ' ',
    ansiEscape: '\x1b',
    ansiColours: {
        red: "2;165;44;50",
        orange: "2;147;63;34",
        yellow: "2;122;80;0",
        green: "2;24;103;31",
        turquoise: "2;4;98;76",
        blue: "2;45;91;134",
        purple: "2;121;60;150",
        pink: "2;143;56;114",
        grey: "2;91;87;88",

        white: "2;245;245;245",
        black: "2;51;51;51",
    },
};



/** # CLASS
 ** ======================================================================== **/

export abstract class AbstractCore<Opts extends AbstractCoreOpts> {

    public abstract get optsDefault(): Opts;

    public opts: Opts;

    /**
     * New version of this obj’s opts with given overrides.
     */
    protected _getOpts( opts: Partial<Opts> ): Opts {
        return this.parseArgs( this.opts ?? this.optsDefault, opts, true );
    }



    /** CONSTRUCTOR
     ** ==================================================================== **/

    constructor ( opts: Partial<Opts> = {} ) {
        this.opts = this._getOpts( opts );
    }



    /** BUILT-IN ALIASES
     ** Aliases for built-in functions/expressions.
     ** ==================================================================== **/

    /**
     * Alias for `typeof` keyword, but with added options: "class", "NaN", "null".
     */
    protected typeOf(
        variable: any,
    ): "bigint" | "boolean" | "class" | "function" | "null" | "number"
        | "object" | "string" | "symbol" | "NaN" | "undefined" {

        /**
         * BY VALUE
         */
        if ( variable === null ) { return 'null'; }
        if ( variable === undefined ) { return 'undefined'; }

        const type_of = typeof variable;

        /**
         * BY TYPE
         */
        switch ( type_of ) {

            case 'function':
                return typeof variable.prototype === 'undefined'
                    ? 'function'
                    : 'class';

            case 'number':
                if ( isNaN( variable ) ) { return 'NaN'; }
                break;
        }
        return type_of;
    }



    /** OVERRIDING BUILT-IN METHODS
     ** ==================================================================== **/

    /**
     * Overwrites the default function to return a string representation of this
     * object.
     *
     * @override  Default value in `Object.prototype`.
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
     */
    public toString(): string { return JSON.stringify( this, null, 4 ); }



    /** PRE-FORMATTED STRINGS
     ** ==================================================================== **/

    /** 
     * To use for tabs/indents based on this.opts values.
     */
    protected get tab(): string {
        return this.opts.tabCharacter.repeat( this.opts.tabWidth );
    }



    /** REGULAR EXPRESSIONS
     ** ==================================================================== **/

    /**
     * Escapes a string for use in a regular expression.
     */
    protected escRegExp( convertMe: string ): string {
        return convertMe.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
    }

    /**
     * Escapes a string for use as a replacement for a regular expression.
     */
    protected escRegExpReplace( convertMe: string ): string {
        return convertMe.replace( /\$/g, '$$$$' );
    }



    /** WORKING WITH OPTION OBJECTS
     ** ==================================================================== **/

    /**
     * Returns an updated version of `defaults` based on the parse contents of
     * `inputs`. Useful for parsing objects passed to functions with extra,
     * optional options.
     *
     * Just here as the core function for both `this.parseArgs` and
     * `this.mergeArgs`, use those public functions externally instead.
     *
     * @param defaults             The default values (backups).
     * @param inputs               The overriding values (to change).
     * @param recursive            Optional. Whether to parse/merge the object
     *                             recursively. Default false.
     * @param includeAllInputKeys  Whether to include all keys of `inputs`,
     *                             regardless of if they’re a key of `defaults`.
     *
     * @return  Resulting object with all the `defaults` keys with either
     *          default values or input values, as appropriate.
     */
    protected _combineArgs<D, I extends Partial<D>>(
        defaults: D,
        inputs: I | undefined,
        recursive: boolean,
        includeAllInputKeys: boolean,
    ): D {
        if ( typeof inputs !== 'object' || !inputs ) { return { ...defaults }; }

        let result: D = { ...defaults };

        const inputKeys = Object.keys( inputs ) as ( keyof D )[];

        for ( const key of inputKeys ) {

            if (
                !includeAllInputKeys
                && typeof defaults[ key ] === 'undefined'
            ) { continue; }

            if (
                recursive
                && typeof defaults[ key ] === 'object'
                && typeof inputs[ key ] === 'object'
                && !Array.isArray( defaults[ key ] )
                && !Array.isArray( inputs[ key ] )
            ) {

                // get deep
                result[ key ] = this._combineArgs(
                    defaults[ key ],
                    inputs[ key ] as Partial<D[ keyof D ]>,
                    recursive,
                    includeAllInputKeys,
                );
            } else {

                // single-level
                result[ key ] = ( inputs[ key ] ?? defaults[ key ] ) as D[ keyof D ];
            }
        }
        return result;
    }

    /**
     * Alias for `this._combineArgs()` with `includeAllInputKeys = true`.
     * 
     * @see this._combineArgs()  Contains the actual logic.
     */
    protected mergeArgs<D, I extends Partial<D>>(
        defaults: D,
        inputs: I | undefined,
        recursive: boolean = false,
    ): D {
        return this._combineArgs( defaults, inputs, recursive, true );
    }

    /**
     * Alias for `this._combineArgs()` with `includeAllInputKeys = false`.
     *
     * @see this._combineArgs()  Contains the actual logic.
     */
    protected parseArgs<D, I extends Partial<D>>(
        defaults: D,
        inputs: I | undefined,
        recursive: boolean = false,
    ): D {
        return this._combineArgs( defaults, inputs, recursive, false );
    }
}