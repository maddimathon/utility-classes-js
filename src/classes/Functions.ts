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

import type { LangCode, LangLocaleCode } from '../types/strings.js';

import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';

import type { VariableInspectorOpts } from './VariableInspector.js';
import { VariableInspector } from './VariableInspector.js';



/** # TYPES
 ** ======================================================================== **/


/** ## Opts Interface ==================================== **/

export namespace FunctionTypes {

    export type MsgOpts = {
        clr: keyof AbstractCoreOpts[ 'ansiColours' ] | false,
        flag: boolean,
        bold: boolean,
        italic: boolean,

        /**
         * Number of spaces for a hanging indent. Defaults to values of
         * AbstractCoreOpts.tabWidth.
         */
        indent: number,

        leadInLines: number, // how many black lines before the message
        leadOutLines: number, // how many black lines after the message
    };
};

/**
 * Options for instances of the Functions class.
 */
export interface FunctionsOpts extends AbstractCoreOpts {

    /** Language code to use for content. */
    lang: LangCode | LangLocaleCode;

    formats: {
        date: Intl.DateTimeFormatOptions;
        datetime: Intl.DateTimeFormatOptions;
        time: Intl.DateTimeFormatOptions;
    };

    /** Default options for the `msg()` method. */
    msgOpts: FunctionTypes.MsgOpts;

    varInspectorOpts: Partial<VariableInspectorOpts>;
}



/** # CLASS
 ** ======================================================================== **/

/**
 * General utility functions as an abstract to extend.  Helpful for creating
 * use-specific utility function classes (e.g., NodeFunctions).
 */
export class Functions<Opts extends FunctionsOpts = FunctionsOpts> extends AbstractCore<Opts> {

    /** 
     * Use the functions without configuration (alternative to making all
     * methods static).
     */
    static #static: Functions;

    /**
     * Use the functions without configuration.
     */
    public static get st(): Functions {

        if ( typeof Functions.#static === 'undefined' ) {
            Functions.#static = new Functions();
        }
        return Functions.#static;
    }



    /** LOCAL
     ** ==================================================================== **/

    public get optsDefault(): Opts {

        return {
            ...AbstractCoreOptsDefault,

            lang: 'en-CA',
            formats: {
                date: {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                },
                time: {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    // second: '2-digit',
                },
                datetime: {
                    hour12: false,

                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',

                    hour: '2-digit',
                    minute: '2-digit',
                    // second: '2-digit',
                },
            },

            msgOpts: {
                clr: false,
                flag: false,
                bold: false,
                italic: false,
                indent: 0,
                leadInLines: 0,
                leadOutLines: 0,
            },

            varInspectorOpts: VariableInspector.prototype.optsDefault,

        } as Opts;
    }

    /**
     * New version of this obj’s opts with given overrides.
     */
    protected override _getOpts( opts: Partial<Opts> ): Opts {

        let resultOpts: Opts = super._getOpts( opts );

        resultOpts.formats.date = this.mergeArgs(
            resultOpts.formats.date,
            opts.formats?.date ?? {},
            true
        );

        resultOpts.formats.time = this.mergeArgs(
            resultOpts.formats.time,
            opts.formats?.time ?? {},
            true
        );

        resultOpts.formats.datetime = this.mergeArgs(
            resultOpts.formats.datetime,
            opts.formats?.datetime ?? {},
            true
        );

        resultOpts.varInspectorOpts = this.mergeArgs(
            resultOpts.varInspectorOpts,
            opts.varInspectorOpts ?? {},
            true
        );

        return resultOpts;
    }



    /** CONSTRUCTOR
     ** ==================================================================== **/

    constructor ( opts: Partial<Opts> = {} ) {
        super( opts );
    }



    /** CHANGING INHERITED ACCESS
     ** ==================================================================== **/

    public override escRegExp(
        ...params: Parameters<AbstractCore<Opts>[ 'escRegExp' ]>
    ): ReturnType<AbstractCore<Opts>[ 'escRegExp' ]> {
        return super.escRegExp( ...params );
    }

    public override escRegExpReplace(
        ...params: Parameters<AbstractCore<Opts>[ 'escRegExpReplace' ]>
    ): ReturnType<AbstractCore<Opts>[ 'escRegExpReplace' ]> {
        return super.escRegExpReplace( ...params );
    }

    public override mergeArgs<D, I extends Partial<D>>(
        defaults: D,
        inputs: I | undefined,
        recursive: boolean = false,
    ): D {
        return super.mergeArgs( defaults, inputs, recursive );
    }

    public override parseArgs<D, I extends Partial<D>>(
        defaults: D,
        inputs: I | undefined,
        recursive: boolean = false,
    ): D {
        return super.parseArgs( defaults, inputs, recursive );
    }

    public override typeOf(
        ...params: Parameters<AbstractCore<Opts>[ 'typeOf' ]>
    ): ReturnType<AbstractCore<Opts>[ 'typeOf' ]> {
        return super.typeOf( ...params );
    }



    /** OBJECT MANIPULATION
     ** ==================================================================== **/


    /** Objects ==================================== **/


    /** Arrays ------------------ **/

    /**
     * Removes the given item from its array.
     * 
     * @param array           
     * @param _itemsToRemove  The item(s) to remove from the array.
     * 
     * @return The given array without the item(s) in `itemsToRemove`.
     */
    public arrayRemove<I, A extends ( I | any )[]>(
        array: A,
        _itemsToRemove: I | I[],
    ): A {
        const itemsToRemove = !Array.isArray( _itemsToRemove )
            ? [ _itemsToRemove ]
            : _itemsToRemove;

        for ( const item of itemsToRemove ) {

            const indexOfItem = array.indexOf( item );

            if ( indexOfItem > -1 ) { array.splice( indexOfItem, 1 ); }
        }
        return array;
    }

    /**
     * Uses `Array.prototype.filter()`.
     * 
     * @param arr  Array whose items should be made unique.
     */
    public arrayUnique<I>( arr: I[] ): I[] {
        return arr.filter( ( v, i, a ) => Boolean( a.indexOf( v ) === i ) );
    }


    /** Strings ==================================== **/

    /**
     * @param text           Text to hard wrap to a character limit.
     * @param width          Optional. Maximum character width for each line. Default 80.
     * @param hangingIndent  Optional. Length of hanging indent. Default 0.
     */
    public hardTextWrap(
        text: string,
        width: number = 80,
        hangingIndent: number = 0
    ): string {

        const getLineIndent = ( line: number ): string => {
            return line == 1 ? '' : this.opts.tabCharacter.repeat( hangingIndent );
        };

        let wrappedText: string[] = [];

        for ( let inputLine of text.split( `\n` ) ) {

            let i = 1;
            let thisLineIndent = getLineIndent( i );

            while ( inputLine.length > width ) {

                thisLineIndent = getLineIndent( i );

                const thisLineLength = width - thisLineIndent.length;

                const subString = inputLine.substring( 0, thisLineLength );

                wrappedText.push( thisLineIndent + subString );

                inputLine = inputLine.replace(
                    new RegExp( `^${ this.escRegExp( subString ) }`, 'g' ),
                    ''
                );
                i++;
            }

            wrappedText.push( thisLineIndent + inputLine );
        }

        return wrappedText.join( `\n` );
    }

    /**
     * Adds an indent after every new line.
     * 
     * @param str     
     * @param indent  Optional. Default `this.tab`.
     * 
     * @return  The same text, but with an indent added after every new line.
     * 
     * @see this.tab  Default for `indent` param.
     */
    public hangingIndent(
        str: string,
        indent: string = this.tab,
    ): string {
        return str.replace( /\n/gis, '\n' + indent );
    }

    /**
     * Turns the given slug into a string with only a-z, 0-9, 
     * and hyphens (`-`).
     * 
     * @param convertMe  String to convert.
     * 
     * @return  Slug version of the input string.
     */
    public slugify( convertMe: string ): string {

        let slug: string = convertMe.toLowerCase();

        // replace accented letters
        slug = slug.replace( /(À|Á|Â|Ä|Ã|Æ|Å|Ā|à|á|â|ä|ã|æ|å|ā)/gi, 'a' );
        slug = slug.replace( /(È|É|Ê|Ë|Ē|Ė|Ę|è|é|ê|ë|ē|ė|ę)/gi, 'e' );
        slug = slug.replace( /(Î|Ï|Í|Ī|Į|Ì|î|ï|í|ī|į|ì)/gi, 'i' );
        slug = slug.replace( /(Ô|Ö|Ò|Ó|Œ|Ø|Ō|Õ|ô|ö|ò|ó|œ|ø|ō|õ)/gi, 'o' );
        slug = slug.replace( /(Û|Ü|Ù|Ú|Ū|û|ü|ù|ú|ū)/gi, 'u' );
        slug = slug.replace( /(Ñ|Ń|ñ|ń)/gi, 'n' );

        // change ampersands to 'and'
        slug = slug.replace( /(\s)&+(\s)/gi, '$1and$2' );
        // remove non-letters & non-digits (except spaces & some punctuation, 
        // which will become dashes)
        slug = slug.replace( /[^\s|a-z|\d|\n|\-|–|—|_|\:|\;|\/]+/gi, '' );
        // and now everything else is a dash!
        slug = slug.replace( /[^\d|a-z]+/gi, '-' );
        // remove leading/trailing "whitespace"
        slug = slug.replace( /(^[\n|\s|\-]+|[\n|\s|\-]+$)/gi, '' );

        // remove multi-dashes
        slug = slug.replace( /-+/gi, '-' );

        return slug;
    }

    /**
     * Converts string to an approximate title case.
     * 
     * @param convertMe  
     * 
     * @return Input string in title case.
     */
    public toTitleCase( convertMe: string ): string {
        /** @link https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript */
        return convertMe.replace(
            /\w\S*/g,
            t => t.charAt( 0 ).toUpperCase() + t.slice( 1 ).toLowerCase()
        );
    }



    /** META & DEBUGGING UTILITIES
     ** ==================================================================== **/


    /** VariableInspector ==================================== **/

    /**
     * Alias for `VariableInspector.stringify()`.
     * @see VariableInspector#stringify
     */
    public varInspect(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        opts: Partial<VariableInspectorOpts & FunctionTypes.MsgOpts> = {},
    ): string {

        return this.msg( VariableInspector.stringify( variable, {
            ...this.opts.varInspectorOpts,
            ...opts,
        } ), opts );
    }

    /**
     * Alias for `console.log( this.varInspect() )`
     * @see Functions#varInspect()
     */
    public varDump(
        ...params: Parameters<Functions[ 'varInspect' ]>
    ): void {
        return console.log( this.varInspect( ...params ) );
    }



    /** PREFORMATTED VALUES
     ** ==================================================================== **/

    /**
     * A predictably-formatted datestamp.
     * 
     * @param date  Optional. Default is a new Date object.
     * 
     * @return
     */
    public datestamp(
        date: Date = new Date(),
        language: LangCode | LangLocaleCode | null = null,
        formatOpts: Intl.DateTimeFormatOptions = {}
    ): string {

        return date.toLocaleString(
            language ?? this.opts.lang,
            this.mergeArgs( this.opts.formats.date, formatOpts )
        );
    }

    /**
     * A predictably-formatted datetimestamp.
     * 
     * @param date  Optional. Default is a new Date object.
     * 
     * @return
     */
    public datetimestamp(
        date: Date = new Date(),
        language: LangCode | LangLocaleCode | null = null,
        formatOpts: Intl.DateTimeFormatOptions = {}
    ): string {

        return date.toLocaleString(
            language ?? this.opts.lang,
            this.mergeArgs( this.opts.formats.datetime, formatOpts )
        );
    }

    /**
     * A predictably-formatted timestamp.
     * 
     * @param date  Optional. Default is a new Date object.
     * 
     * @return
     */
    public timestamp(
        date: Date = new Date(),
        language: LangCode | LangLocaleCode | null = null,
        formatOpts: Intl.DateTimeFormatOptions = {}
    ): string {

        return date.toLocaleString(
            language ?? this.opts.lang,
            this.mergeArgs( this.opts.formats.time, formatOpts )
        );
    }



    /** TERMINAL
     ** ==================================================================== **/

    /**
     * Alias for `console.log( this.msg() )`
     * 
     * @param msg    
     * @param _opts  
     */
    public log(
        _msg: string,
        _opts: Partial<FunctionTypes.MsgOpts> = {}
    ): void {
        console.log( this.msg( _msg, _opts ) );
    }

    /**
     * Retuns a string formatted for a terminal message.
     * 
     * @param _msg    
     * @param _opts  
     * 
     * @return  Message ready for the terminal.
     */
    public msg(
        _msg: string,
        _opts: Partial<FunctionTypes.MsgOpts> = {}
    ): string {
        const msg: string = _msg;
        const opts: FunctionTypes.MsgOpts = this.parseArgs(
            this.opts.msgOpts,
            _opts
        );

        /** @const num  Numbers for bold/italics as appropriate. */
        const num: string = [
            opts.bold ? '1' : false,
            opts.italic ? '3' : false,
        ].filter( v => v !== false ).join( ';' );


        /**
         * Prep colours
         */

        /** @const clrCode */
        const clrCode: false | string
            = opts.clr ? this.opts.ansiColours[ opts.clr ] : false;

        /** @const ansiColourParts */
        const ansiColourParts: string[] = [

            clrCode
                ? ( opts.flag
                    ? `48;${ clrCode };38;${ this.opts.ansiColours.white }`
                    : `38;${ clrCode }` )
                : false,

            num !== '' ? num : false,
        ].filter( v => v !== false ) as string[];

        /** @const ansiReset */
        const ansiReset: string = this.opts.ansiEscape + '[0m';

        /**
         * RETURN 
         */
        const returnArray: string[] = [
            opts.leadInLines > 0 ? `\n`.repeat( opts.leadInLines ) : '',

            ansiReset,

            ansiColourParts.length > 0
                ? this.opts.ansiEscape + '[' + ansiColourParts.join( ';' ) + 'm'
                : ansiReset,

            opts.indent > 0
                ? this.hangingIndent(
                    msg,
                    this.opts.tabCharacter.repeat( opts.indent )
                )
                // ? msg.split( `\n` ).map(
                //     ( line: string, index: number ): string => {
                //         if ( index === 0 ) { return line; }
                //         return this.opts.tabCharacter.repeat( opts.indent ) + line;
                //     }
                // ).join( `\n` )
                : msg,

            ansiReset,

            opts.leadOutLines > 0 ? `\n`.repeat( opts.leadOutLines ) : '',

        ];
        return returnArray.join( '' );
    }

    /**
     * Alias for `console.log( this.timestampMsg() )`
     * 
     * @param msg    
     * @param _opts  
     * 
     * @return  Message ready for the terminal.
     */
    public timestampLog(
        ...params: Parameters<Functions[ 'timestampMsg' ]>
    ): void {
        console.log( this.timestampMsg( ...params ) );
    }

    /**
     * Returns a timestamped version of `msg()`.
     * 
     * @param msg    
     * @param _opts  
     * 
     * @return  Timestamped message ready for the terminal.
     */
    public timestampMsg(
        msg: string,
        _opts: Partial<FunctionTypes.MsgOpts> = {},
        date: Date | undefined = undefined,
    ) {
        const opts: FunctionTypes.MsgOpts = this.parseArgs(
            this.opts.msgOpts,
            _opts
        );

        const prefix = `[${ this.timestamp( date ) }] `;

        return this.msg( prefix, {
            ...opts,
            italic: false,
            flag: false,
            indent: 0,
        } ) + this.hangingIndent(
            msg.split( `\n` ).map( ( line: string ): string => {
                return this.msg( line, {
                    ...opts,
                    indent: 0,
                } );
            } ).join( `\n` ),
            this.opts.tabCharacter.repeat( opts.indent + prefix.length )
        );
    }

    /**
     * Alias for `console.log( this.timestampVarInspect() )`.
     */
    public timestampVarDump(
        ...params: Parameters<Functions[ 'timestampVarInspect' ]>
    ): void {
        return console.log( this.timestampVarInspect( ...params ) );
    }

    /**
     * Alias for `this.varInspect()`.
     * 
     * @param msg    
     * @param _opts  
     */
    public timestampVarInspect(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        opts: Partial<VariableInspectorOpts & FunctionTypes.MsgOpts> = {},
    ): string {

        const timestamp = this.timestampMsg( '', opts );

        return timestamp + this.hangingIndent(
            this.varInspect( variable, opts ),
            this.opts.tabCharacter.repeat( timestamp.length + 3 )
        );
    }
}