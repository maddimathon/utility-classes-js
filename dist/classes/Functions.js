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
var _a, _Functions_static;
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';
import { VariableInspector } from './VariableInspector.js';
;
export class Functions extends AbstractCore {
    static get st() {
        if ( typeof __classPrivateFieldGet( _a, _a, "f", _Functions_static ) === 'undefined' ) {
            __classPrivateFieldSet( _a, _a, new _a(), "f", _Functions_static );
        }
        return __classPrivateFieldGet( _a, _a, "f", _Functions_static );
    }
    get optsDefault() {
        return Object.assign( Object.assign( {}, AbstractCoreOptsDefault ), {
            lang: 'en-CA', formats: {
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
                },
                datetime: {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                },
            }, msgOpts: {
                clr: false,
                flag: false,
                bold: false,
                italic: false,
                indent: 0,
                leadInLines: 0,
                leadOutLines: 0,
            }, varInspectorOpts: VariableInspector.prototype.optsDefault
        } );
    }
    _getOpts( opts ) {
        var _b, _c, _d, _e, _f, _g, _h;
        let resultOpts = super._getOpts( opts );
        resultOpts.formats.date = this.mergeArgs( resultOpts.formats.date, ( _c = ( _b = opts.formats ) === null || _b === void 0 ? void 0 : _b.date ) !== null && _c !== void 0 ? _c : {}, true );
        resultOpts.formats.time = this.mergeArgs( resultOpts.formats.time, ( _e = ( _d = opts.formats ) === null || _d === void 0 ? void 0 : _d.time ) !== null && _e !== void 0 ? _e : {}, true );
        resultOpts.formats.datetime = this.mergeArgs( resultOpts.formats.datetime, ( _g = ( _f = opts.formats ) === null || _f === void 0 ? void 0 : _f.datetime ) !== null && _g !== void 0 ? _g : {}, true );
        resultOpts.varInspectorOpts = this.mergeArgs( resultOpts.varInspectorOpts, ( _h = opts.varInspectorOpts ) !== null && _h !== void 0 ? _h : {}, true );
        return resultOpts;
    }
    constructor ( opts = {} ) {
        super( opts );
    }
    escRegExp( ...params ) {
        return super.escRegExp( ...params );
    }
    escRegExpReplace( ...params ) {
        return super.escRegExpReplace( ...params );
    }
    mergeArgs( defaults, inputs, recursive = false ) {
        return super.mergeArgs( defaults, inputs, recursive );
    }
    parseArgs( defaults, inputs, recursive = false ) {
        return super.parseArgs( defaults, inputs, recursive );
    }
    typeOf( ...params ) {
        return super.typeOf( ...params );
    }
    arrayRemove( array, _itemsToRemove ) {
        const itemsToRemove = !Array.isArray( _itemsToRemove )
            ? [ _itemsToRemove ]
            : _itemsToRemove;
        for ( const item of itemsToRemove ) {
            const indexOfItem = array.indexOf( item );
            if ( indexOfItem > -1 ) {
                array.splice( indexOfItem, 1 );
            }
        }
        return array;
    }
    arrayUnique( arr ) {
        return arr.filter( ( v, i, a ) => Boolean( a.indexOf( v ) === i ) );
    }
    hardTextWrap( text, width = 80, hangingIndent = 0 ) {
        const getLineIndent = ( line ) => {
            return line == 1 ? '' : this.opts.tabCharacter.repeat( hangingIndent );
        };
        let wrappedText = [];
        for ( let inputLine of text.split( `\n` ) ) {
            let i = 1;
            let thisLineIndent = getLineIndent( i );
            while ( inputLine.length > width ) {
                thisLineIndent = getLineIndent( i );
                const thisLineLength = width - thisLineIndent.length;
                const subString = inputLine.substring( 0, thisLineLength );
                wrappedText.push( thisLineIndent + subString );
                inputLine = inputLine.replace( new RegExp( `^${ this.escRegExp( subString ) }`, 'g' ), '' );
                i++;
            }
            wrappedText.push( thisLineIndent + inputLine );
        }
        return wrappedText.join( `\n` );
    }
    hangingIndent( str, indent = this.tab ) {
        return str.replace( /\n/gis, '\n' + indent );
    }
    slugify( convertMe ) {
        let slug = convertMe.toLowerCase();
        slug = slug.replace( /(À|Á|Â|Ä|Ã|Æ|Å|Ā|à|á|â|ä|ã|æ|å|ā)/gi, 'a' );
        slug = slug.replace( /(È|É|Ê|Ë|Ē|Ė|Ę|è|é|ê|ë|ē|ė|ę)/gi, 'e' );
        slug = slug.replace( /(Î|Ï|Í|Ī|Į|Ì|î|ï|í|ī|į|ì)/gi, 'i' );
        slug = slug.replace( /(Ô|Ö|Ò|Ó|Œ|Ø|Ō|Õ|ô|ö|ò|ó|œ|ø|ō|õ)/gi, 'o' );
        slug = slug.replace( /(Û|Ü|Ù|Ú|Ū|û|ü|ù|ú|ū)/gi, 'u' );
        slug = slug.replace( /(Ñ|Ń|ñ|ń)/gi, 'n' );
        slug = slug.replace( /(\s)&+(\s)/gi, '$1and$2' );
        slug = slug.replace( /[^\s|a-z|\d|\n|\-|–|—|_|\:|\;|\/]+/gi, '' );
        slug = slug.replace( /[^\d|a-z]+/gi, '-' );
        slug = slug.replace( /(^[\n|\s|\-]+|[\n|\s|\-]+$)/gi, '' );
        slug = slug.replace( /-+/gi, '-' );
        return slug;
    }
    toTitleCase( convertMe ) {
        return convertMe.replace( /\w\S*/g, t => t.charAt( 0 ).toUpperCase() + t.slice( 1 ).toLowerCase() );
    }
    varInspect( variable, opts = {} ) {
        return this.msg( VariableInspector.stringify( variable, Object.assign( Object.assign( {}, this.opts.varInspectorOpts ), opts ) ), opts );
    }
    varDump( ...params ) {
        return console.log( this.varInspect( ...params ) );
    }
    datestamp( date = new Date(), language = null, formatOpts = {} ) {
        return date.toLocaleString( language !== null && language !== void 0 ? language : this.opts.lang, this.mergeArgs( this.opts.formats.date, formatOpts ) );
    }
    datetimestamp( date = new Date(), language = null, formatOpts = {} ) {
        return date.toLocaleString( language !== null && language !== void 0 ? language : this.opts.lang, this.mergeArgs( this.opts.formats.datetime, formatOpts ) );
    }
    timestamp( date = new Date(), language = null, formatOpts = {} ) {
        return date.toLocaleString( language !== null && language !== void 0 ? language : this.opts.lang, this.mergeArgs( this.opts.formats.time, formatOpts ) );
    }
    log( _msg, _opts = {} ) {
        console.log( this.msg( _msg, _opts ) );
    }
    msg( _msg, _opts = {} ) {
        const msg = _msg;
        const opts = this.parseArgs( this.opts.msgOpts, _opts );
        const num = [
            opts.bold ? '1' : false,
            opts.italic ? '3' : false,
        ].filter( v => v !== false ).join( ';' );
        const clrCode = opts.clr ? this.opts.ansiColours[ opts.clr ] : false;
        const ansiColourParts = [
            clrCode
                ? ( opts.flag
                    ? `48;${ clrCode };38;${ this.opts.ansiColours.white }`
                    : `38;${ clrCode }` )
                : false,
            num !== '' ? num : false,
        ].filter( v => v !== false );
        const ansiReset = this.opts.ansiEscape + '[0m';
        const returnArray = [
            opts.leadInLines > 0 ? `\n`.repeat( opts.leadInLines ) : '',
            ansiReset,
            ansiColourParts.length > 0
                ? this.opts.ansiEscape + '[' + ansiColourParts.join( ';' ) + 'm'
                : ansiReset,
            opts.indent > 0
                ? this.hangingIndent( msg, this.opts.tabCharacter.repeat( opts.indent ) )
                : msg,
            ansiReset,
            opts.leadOutLines > 0 ? `\n`.repeat( opts.leadOutLines ) : '',
        ];
        return returnArray.join( '' );
    }
    timestampLog( ...params ) {
        console.log( this.timestampMsg( ...params ) );
    }
    timestampMsg( msg, _opts = {}, date = undefined ) {
        const opts = this.parseArgs( this.opts.msgOpts, _opts );
        const prefix = `[${ this.timestamp( date ) }] `;
        return this.msg( prefix, Object.assign( Object.assign( {}, opts ), { italic: false, flag: false, indent: 0 } ) ) + this.hangingIndent( msg.split( `\n` ).map( ( line ) => {
            return this.msg( line, Object.assign( Object.assign( {}, opts ), { indent: 0 } ) );
        } ).join( `\n` ), this.opts.tabCharacter.repeat( opts.indent + prefix.length ) );
    }
    timestampVarDump( ...params ) {
        return console.log( this.timestampVarInspect( ...params ) );
    }
    timestampVarInspect( variable, opts = {} ) {
        const timestamp = this.timestampMsg( '', opts );
        return timestamp + this.hangingIndent( this.varInspect( variable, opts ), this.opts.tabCharacter.repeat( timestamp.length + 3 ) );
    }
}
_a = Functions;
_Functions_static = { value: void 0 };
