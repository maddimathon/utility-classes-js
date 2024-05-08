/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';
export class VariableInspector extends AbstractCore {
    get optsDefault() {
        return Object.assign( Object.assign( {}, AbstractCoreOptsDefault ), { includeEquals: true, includeType: true, includeValue: true, includeFunctionContents: false, includePrototypeDescriptors: true, includeDefaultPrototypeDescriptors: false, includePrototypeInspection: false, localizeDates: false, localizeNumbers: true, multilineBreakVisualizers: false, multilineBreakVisualizerString: '⠀', stringQuoteCharacter: '"' } );
    }
    constructor ( variable, opts = {} ) {
        super( opts );
        if ( Object.keys( variable ).length == 1 ) {
            this._name = Object.keys( variable )[ 0 ];
            this._rawValue = variable[ this._name ];
        }
        else {
            this._name = 'variable';
            this._rawValue = variable;
        }
        this._typeOf = this.typeOf( this._rawValue );
    }
    _new( variableObj, optsOverride = {} ) {
        return new VariableInspector( variableObj, this._getOpts( Object.assign( { includeEquals: false, includeValue: true }, optsOverride ) ) );
    }
    _objectToStrings( obj, brackets = { open: '{', close: '}' }, _filterObjectKey = true ) {
        const objKeyFilter = _filterObjectKey;
        const contents = Object.keys( obj ).map( ( _key ) => {
            const key = _key;
            const filteredKey = objKeyFilter
                ? this._filterObjectKey( key )
                : `${ key }`;
            const value = Array.isArray( obj[ key ] )
                ? obj[ key ].join( `\n` )
                : obj[ key ];
            return `${ filteredKey }: ${ value }`;
        } ).join( `\n` ).split( `\n` );
        const allContentIsEmpty = contents.length < 1 || contents.every( ( val ) => {
            return Boolean( val.match( /^[\s\n]*$/gis )
                || val.length < 1 );
        } );
        return ( allContentIsEmpty
            ? [ brackets.open + brackets.close ]
            : [
                brackets.open,
                ...contents.map( line => `${ this.tab }${ line }` ),
                brackets.close,
            ] ).join( `\n` );
    }
    _addHangingIndent( convertMe, _indent = this.opts.tabWidth ) {
        const indent = this.opts.tabCharacter.repeat( _indent );
        return convertMe.split( `\n` ).map( ( item, index ) => {
            if ( index === 0 ) {
                return item;
            }
            return `${ indent }${ item }`;
        } ).join( `\n` );
    }
    _filterObjectKey( key ) {
        var _a;
        switch ( typeof key ) {
            case 'function':
                return `{${ key() }}`;
            case 'number':
                return key.toString();
            case 'string':
                if ( String( Number( key ) ) === key
                    && String( Number( key ) ) !== 'NaN' ) {
                    return this._filterObjectKey( Number( key ) );
                }
                return `"${ key }"`;
            case 'symbol':
                return `@@${ ( _a = key.description ) !== null && _a !== void 0 ? _a : String( key ) }`;
        }
        const keyVI = this._new( { key }, {
            includeEquals: false,
        } );
        return `[${ keyVI.toString() }]`;
    }
    _filterType( type ) { return `<${ type }>`; }
    _filterValue( val, optsOverride ) {
        return val !== null && val !== void 0 ? val : '';
    }
    _valueAsBoolean( optsOverride = {} ) {
        const localOpts = this._getOpts( optsOverride );
        return this._filterValue( this._rawValue.toString().toUpperCase(), localOpts );
    }
    _valueAsClass( optsOverride = {} ) {
        const localOpts = this._getOpts( optsOverride );
        return this._filterValue( [
            this._rawValue.name,
            this._valueAsObject( Object.assign( Object.assign( {}, optsOverride ), { includeType: false, includePrototypeInspection: true } ) ),
        ].join( ' ' ), localOpts );
    }
    _valueAsFunction( optsOverride = {} ) {
        var _a;
        const localOpts = this._getOpts( optsOverride );
        const rawValueAsString = this._rawValue.toString();
        const regexPatterns = {
            fnName: '[a-z|0-9|_]+',
            fnContent: '\\{(.*)\\}',
            params: [
                '(',
                [
                    '(',
                    '[^\(\)]*',
                    ')?',
                ],
                ')',
            ].flat().join( '' ),
        };
        const regExps = {
            fnContent: new RegExp( [
                '^.*?',
                regexPatterns[ 'fnContent' ],
                '\s*$',
            ].join( '' ), 'gis' ),
            params: new RegExp( [
                '^',
                [
                    '(((function|get|set)\\s+)?',
                    regexPatterns[ 'fnName' ],
                    '(?=\\s*\\())?',
                ].join( '' ),
                `\\(?${ regexPatterns[ 'params' ] }\\)?`,
                '(=>)?',
                regexPatterns[ 'fnContent' ],
                '$',
            ].join( '\\s*' ), 'gis' ),
        };
        const paramsArray = rawValueAsString
            .replace( regExps[ 'params' ], '$5' )
            .split( /\s*,\s*/gi );
        const params = ( paramsArray.length < 1
            ? ''
            : paramsArray.join( ', ' ) ).replace( /^\s+$/gi, '' ).replace( /(?<!\s)=(?!\s)/gi, ' = ' );
        const fullPrefix = [
            ( _a = this._rawValue.name ) !== null && _a !== void 0 ? _a : this._name,
            `(${ params.length > 0 ? ` ${ params } ` : '' })`,
        ].join( '' );
        const content = rawValueAsString.replace( regExps.fnContent, '$1' ).split( ';' );
        const returnFilter = ( cn ) => {
            if ( !localOpts.includeFunctionContents ) {
                return '';
            }
            if ( cn.length < 1 ) {
                return '{}';
            }
            if ( cn.length === 1 ) {
                return `{ ${ cn.join( '; ' ) }; }`;
            }
            return [
                '{',
                ...cn.map( line => `${ this.tab }${ line };` ),
                '}',
            ].join( `\n` );
        };
        return this._filterValue( [
            fullPrefix,
            returnFilter( content ),
        ].join( ' ' ), localOpts );
    }
    _valueAsNumber( optsOverride = {} ) {
        const localOpts = this._getOpts( optsOverride );
        const localNumber = localOpts.localizeNumbers
            ? this._rawValue.toLocaleString()
            : this._rawValue.toString();
        return this._filterValue( localNumber, localOpts );
    }
    _valueAsObject( optsOverride = {} ) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const localOpts = this._getOpts( optsOverride );
        const thisRawValue = this._rawValue;
        const thisValuePrototype = this._typeOf === 'class'
            ? ( _a = thisRawValue.prototype ) !== null && _a !== void 0 ? _a : thisRawValue
            : ( ( _e = ( _c = ( _b = thisRawValue.prototype ) !== null && _b !== void 0 ? _b : Object.getPrototypeOf( thisRawValue ) ) !== null && _c !== void 0 ? _c : ( _d = thisRawValue.constructor ) === null || _d === void 0 ? void 0 : _d.prototype ) !== null && _e !== void 0 ? _e : thisRawValue );
        let inspectedObj = {};
        const childInspection = ( value, key = '_', filterOptsOverride = {} ) => {
            const valueType = this.typeOf( value );
            let includeValue = true;
            switch ( valueType ) {
                case 'class':
                    includeValue = false;
                    break;
            }
            return this._new( { [ key ]: value }, Object.assign( Object.assign( Object.assign( {}, localOpts ), { includeEquals: false, includeValue: includeValue } ), filterOptsOverride ) ).toString();
        };
        const propertyInspector = ( p ) => {
            var _a, _b, _c, _d;
            const propertyDescriptor = ( _b = ( _a = Object.getOwnPropertyDescriptor( thisRawValue, p.key ) ) !== null && _a !== void 0 ? _a : Object.getOwnPropertyDescriptor( thisValuePrototype, p.key ) ) !== null && _b !== void 0 ? _b : {};
            const thisProperty = ( _d = ( _c = thisRawValue[ p.key ] ) !== null && _c !== void 0 ? _c : thisValuePrototype[ p.key ] ) !== null && _d !== void 0 ? _d : propertyDescriptor.value;
            const typeOfThisProperty = this.typeOf( thisProperty );
            if ( p.key === 'prototype' || p.key === '__proto__'
                || ( !localOpts.includeDefaultPrototypeDescriptors
                    && ( ( thisProperty instanceof Object
                        && ( p.key === 'constructor'
                            || p.key === '__defineGetter__'
                            || p.key === '__defineSetter__'
                            || p.key === '__lookupGetter__'
                            || p.key === '__lookupSetter__'
                            || p.key === 'hasOwnProperty'
                            || p.key === 'isPrototypeOf'
                            || p.key === 'propertyIsEnumerable'
                            || p.key === 'toLocaleString'
                            || p.key === 'toString'
                            || p.key === 'valueOf' ) )
                        || ( Array.isArray( thisProperty )
                            && ( p.key === 'at'
                                || p.key === 'concat'
                                || p.key === 'copyWithin'
                                || p.key === 'fill'
                                || p.key === 'find'
                                || p.key === 'findIndex'
                                || p.key === 'findLast'
                                || p.key === 'findLastIndex'
                                || p.key === 'lastIndexOf'
                                || p.key === 'length'
                                || p.key === 'pop'
                                || p.key === 'push'
                                || p.key === 'reverse'
                                || p.key === 'shift'
                                || p.key === 'unshift'
                                || p.key === 'slice'
                                || p.key === 'sort'
                                || p.key === 'splice'
                                || p.key === 'includes'
                                || p.key === 'indexOf'
                                || p.key === 'join'
                                || p.key === 'keys'
                                || p.key === 'entries'
                                || p.key === 'values'
                                || p.key === 'forEach'
                                || p.key === 'filter'
                                || p.key === 'flat'
                                || p.key === 'flatMap'
                                || p.key === 'map'
                                || p.key === 'every'
                                || p.key === 'some'
                                || p.key === 'reduce'
                                || p.key === 'reduceRight'
                                || p.key === 'toReversed'
                                || p.key === 'toSorted'
                                || p.key === 'toSpliced'
                                || p.key === 'with' ) ) ) ) ) {
                return false;
            }
            const returnObjBuilder = ( val, valType ) => {
                const key = typeof p.keyFilter === 'function'
                    ? p.keyFilter( p.key )
                    : this._filterObjectKey( p.key );
                if ( valType === 'string' ) {
                    val = this._addHangingIndent( val, key.length + 2 );
                }
                return {
                    key: key,
                    value: val,
                };
            };
            if ( p.key === 'constructor' && typeOfThisProperty === 'class' ) {
                return returnObjBuilder( this._filterType( 'constructor' ), typeOfThisProperty );
            }
            if ( propertyDescriptor.get || propertyDescriptor.set ) {
                const valueBuilder = ( v ) => {
                    return propertyDescriptor[ v ] && `└─ ${ childInspection( propertyDescriptor[ v ], '_', { includeType: false, } ) }`;
                };
                return returnObjBuilder( this._addHangingIndent( [
                    ' ',
                    valueBuilder( 'get' ),
                    valueBuilder( 'set' ),
                ].filter( l => l !== false ).join( `\n` ), localOpts.tabWidth ), typeOfThisProperty );
            }
            return returnObjBuilder( childInspection( thisProperty ), typeOfThisProperty );
        };
        const objectKeys = Object.keys( thisRawValue );
        for ( const key of objectKeys ) {
            const inspectedStrings = propertyInspector( { key } );
            if ( inspectedStrings === false ) {
                continue;
            }
            inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
        }
        const propertySymbols = Object.getOwnPropertySymbols( thisRawValue );
        for ( const key of propertySymbols ) {
            const inspectedStrings = propertyInspector( { key } );
            if ( inspectedStrings === false ) {
                continue;
            }
            if ( !objectKeys.includes( String( key ) ) ) {
                inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
            }
        }
        const propertyNames = Object.getOwnPropertyNames( thisRawValue );
        for ( const key of propertyNames ) {
            const inspectedStrings = propertyInspector( {
                key,
                keyFilter: ( k ) => `[${ this._filterObjectKey( k ) }]`,
            } );
            if ( inspectedStrings === false ) {
                continue;
            }
            if ( !objectKeys.includes( key )
                && !( Object.keys( inspectedObj ).includes( this._filterObjectKey( key ) )
                    && typeof key === 'symbol' ) ) {
                inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
            }
        }
        const propertyDescs = Object.getOwnPropertyDescriptors( thisRawValue );
        let propDescsKeyArray = [];
        for ( const _key in propertyDescs ) {
            const key = _key;
            const inspectedStrings = propertyInspector( {
                key,
                keyFilter: ( k ) => `[${ this._filterObjectKey( k ) }]`,
            } );
            propDescsKeyArray.push( key );
            if ( inspectedStrings === false ) {
                continue;
            }
            const keyString = String( key );
            if ( !objectKeys.includes( keyString )
                && !propertyNames.includes( keyString )
                && !( Object.keys( inspectedObj ).includes( this._filterObjectKey( key ) )
                    && typeof key === 'symbol' ) ) {
                inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
            }
        }
        const prototypeNames = Object.getOwnPropertyNames( thisValuePrototype );
        const prototypeSymbols = Object.getOwnPropertySymbols( thisValuePrototype );
        if ( localOpts.includePrototypeDescriptors && ( Boolean( ( ( _f = thisRawValue.constructor ) === null || _f === void 0 ? void 0 : _f.name ) === 'Array'
            || ( ( _g = thisRawValue.constructor ) === null || _g === void 0 ? void 0 : _g.name ) === 'Function'
            || ( ( _h = thisRawValue.constructor ) === null || _h === void 0 ? void 0 : _h.name ) === 'Object'
            || ( ( _j = thisRawValue.constructor ) === null || _j === void 0 ? void 0 : _j.name ) === 'String' ) === false
            || localOpts.includeDefaultPrototypeDescriptors ) ) {
            for ( const keySet of [ prototypeNames, prototypeSymbols, ] ) {
                for ( const _key of keySet ) {
                    const key = _key;
                    const keyPrefix = this._typeOf === 'class'
                        ? 'prototype'
                        : '';
                    const inspected = propertyInspector( {
                        key,
                        keyFilter: ( k ) => [
                            keyPrefix,
                            `[${ this._filterObjectKey( k ) }]`,
                        ].join( '' ),
                    } );
                    if ( inspected === false ) {
                        continue;
                    }
                    const keyString = String( key );
                    if ( !objectKeys.includes( keyString )
                        && !propertyNames.includes( keyString )
                        && !( Object.keys( inspectedObj ).includes( this._filterObjectKey( key ) )
                            && typeof key === 'symbol' )
                        && !propDescsKeyArray.includes( key ) ) {
                        inspectedObj[ inspected.key ]
                            = inspected.value;
                    }
                }
            }
        }
        if ( localOpts.includePrototypeInspection ) {
            const prototypeVI = this._new( { [ `${ this._name }.prototype` ]: thisValuePrototype }, Object.assign( Object.assign( {}, localOpts ), { includeEquals: false, includePrototypeDescriptors: true, includePrototypeInspection: false } ) );
            if ( prototypeVI._value !== undefined ) {
                inspectedObj[ '<prototype>' ] = prototypeVI._value;
            }
        }
        const brackets = this._type === 'Array'
            ? { open: '[', close: ']' }
            : { open: '{', close: '}' };
        inspectedObj = Object.values( inspectedObj ).length > 0
            ? Object.assign( {}, inspectedObj ) : inspectedObj;
        return this._filterValue( this._objectToStrings( inspectedObj, brackets, false ), localOpts );
    }
    _valueAsString( optsOverride = {} ) {
        const localOpts = this._getOpts( optsOverride );
        const rawValue = this._rawValue;
        const isMultiline = Boolean( rawValue.match( `\n` ) );
        const includeLineVisualizers = localOpts.multilineBreakVisualizers && isMultiline;
        const quote = includeLineVisualizers
            ? ''
            : localOpts.stringQuoteCharacter;
        const returnEscape = ( str ) => {
            const multilineFilter = ( _str ) => {
                if ( !isMultiline ) {
                    return _str;
                }
                const str = _str;
                const lineVisualizer = localOpts.multilineBreakVisualizerString;
                let tmpStr = str.split( `\n` );
                const arr = includeLineVisualizers
                    ? tmpStr.map( ( str ) => lineVisualizer + str + lineVisualizer )
                    : tmpStr;
                const indentWidth = [
                    this._prefix.length > 0
                        ? this._prefix.length + 1
                        : this._prefix.length,
                    quote.length,
                    includeLineVisualizers ? lineVisualizer.length : 0,
                    localOpts.includeType
                        ? this._filterType( this._type ).length + 1
                        : 0,
                ].reduce( ( prev, curr ) => prev + curr );
                return this._addHangingIndent( arr.join( `\n` ), indentWidth );
            };
            return multilineFilter( decodeURI( encodeURI( str ).replace( /%1B/g, '\\x1b' ) ) );
        };
        return this._filterValue( quote + returnEscape( rawValue ) + quote, localOpts );
    }
    get _prefix() {
        const returnFilter = ( str ) => {
            return str.replace( /(^[\n\s]+|[\n\s]+$)/gi, '' );
        };
        const basePrefix = [
            this.opts.includeEquals && `${ this._name } =`,
        ]
            .filter( v => v !== false && v.length > 0 )
            .join( ' ' );
        if ( this._typeOf === 'string' ) {
            const rawValue = this._rawValue;
            const paddingLength = ( ind, pre ) => {
                return [
                    ind.length - pre.length - 1,
                    this.opts.includeType
                        ? this._filterType( this._type ).length
                        : false,
                ]
                    .reduce( ( prev, curr ) => {
                        return curr === false ? prev || 0 : ( prev || 0 ) + curr;
                    } );
            };
            let indent = this.tab;
            const minimumPadding = ( 1 ) + this.opts.stringQuoteCharacter.length;
            while ( paddingLength( indent, basePrefix ) < minimumPadding ) {
                indent = indent + this.opts.tabCharacter;
            }
            const paddingBuffer = this.opts.tabCharacter.repeat( paddingLength( indent, basePrefix ) );
            const returnVal = rawValue.match( /\n/g )
                ? ( basePrefix + paddingBuffer ).replace( new RegExp( '.'.repeat( minimumPadding ) + '$', 'gi' ), '' )
                : basePrefix;
            return returnFilter( returnVal );
        }
        return returnFilter( basePrefix );
    }
    get _type() {
        var _a;
        const returnFilter = ( str ) => {
            return str.replace( /(^[\n\s]+|[\n\s]+$)/gi, '' );
        };
        switch ( this._typeOf ) {
            case 'NaN':
                return returnFilter( typeof Number.NaN );
            case 'object':
                const constructorName = ( _a = this._rawValue.constructor ) === null || _a === void 0 ? void 0 : _a.name;
                return returnFilter( constructorName === 'Object'
                    ? 'object'
                    : constructorName );
        }
        return returnFilter( this._typeOf );
    }
    get _value() {
        const via = ( viaMethod ) => `<via ${ viaMethod }>`;
        switch ( this._typeOf ) {
            case 'null':
            case 'undefined':
                return this._filterValue( undefined, {} );
            case 'bigint':
            case 'number':
                return this._valueAsNumber();
            case 'boolean':
                return this._valueAsBoolean();
            case 'class':
                return this._valueAsClass();
            case 'function':
                return this._valueAsFunction();
            case 'NaN':
                return this._filterValue( 'NaN', {} );
            case 'object':
                switch ( this._type ) {
                    case 'object':
                    case 'Array':
                        return this._valueAsObject();
                    case 'Date':
                        const date = this._rawValue;
                        return this._filterValue( this.opts.localizeDates
                            ? date.toLocaleString( 'en-CA' )
                            : date.toString(), {} );
                    case 'RegExp':
                        const regex = this._rawValue;
                        return this._filterValue( regex.toString().replace( /\\/g, '\\\\' ), {} );
                }
                return this._valueAsObject();
            case 'string':
                return this._valueAsString();
        }
        for ( const fn of [
            'toString',
            'stringify',
        ] ) {
            if ( typeof this._rawValue[ fn ] === 'function' ) {
                const fnReturn = this._rawValue[ fn ]();
                if ( typeof fnReturn === 'string' ) {
                    return this._filterValue( [
                        via( `.${ fn }()` ),
                        this._addHangingIndent( fnReturn, this.opts.tabWidth ),
                    ].join( ' ' ), {} );
                }
            }
        }
        return this._filterValue( `${ via( 'interpolation' ) } ${ this._rawValue }`, {} );
    }
    dump() {
        return console.log( this.toString() );
    }
    ;
    toString() {
        return [
            this._prefix,
            this.opts.includeType && this._filterType( this._type ),
            this.opts.includeValue && this._value,
        ].filter( ( val ) => val !== false && val.length > 0 ).join( ' ' );
    }
    valueOf() { return this.toString(); }
    static dump( ...params ) {
        const vi = new VariableInspector( ...params );
        return vi.dump();
    }
    static stringify( ...params ) {
        const vi = new VariableInspector( ...params );
        return vi.toString();
    }
    static test( verbose = false ) {
        const t = {
            undefined,
            null: null,
            true: true,
            false: false,
            bigint: BigInt( 9007199254740991 ),
            number: Number( 207 ),
            'NaN': Number.NaN,
            string: 'string test _value',
            stringMultiline: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec bibendum in\njusto vulputate euismod.Vivamus vel lectus dolor.Curabitur ullamcorper\ninterdum diam, sit amet pulvinar odio tristique eget.Pellentesque sodales\naliquam ex in convallis.Morbi tristique, risus et imperdiet aliquam, libero\ndolor faucibus lacus, in tempus metus elit non ante.`,
            array: [ 'string test _value', Number( 207 ), {}, ],
            objectEmpty: {},
            objectSimple: {
                one: 1,
                two: 2,
            },
            date: new Date( '2024-02-08' ),
            regex: /^regex$/g,
            functionSimple: () => { return 'hello'; },
            functionParams: ( value1, value2 ) => { const test = value2; return test + value1; },
            'class': VariableInspector.TestClass,
            classInstance: new VariableInspector.TestClass(),
        };
        if ( verbose ) {
            console.log( '' );
            VariableInspector.dump( { undefined: t.undefined } );
        }
        console.log( '' );
        VariableInspector.dump( { null: t.null } );
        if ( verbose ) {
            console.log( '' );
            VariableInspector.dump( { 'true': true } );
            console.log( '' );
            VariableInspector.dump( { bigint: t.bigint } );
            console.log( '' );
        }
        VariableInspector.dump( { number: t.number } );
        if ( verbose ) {
            console.log( '' );
        }
        VariableInspector.dump( { NaN: t.NaN } );
        if ( verbose ) {
            console.log( '' );
        }
        VariableInspector.dump( { string: t.string } );
        if ( verbose ) {
            console.log( '' );
            VariableInspector.dump( { stringMultiline: t.stringMultiline } );
            console.log( '' );
            VariableInspector.dump( { array: t.array } );
            console.log( '' );
            VariableInspector.dump( { objectEmpty: t.objectEmpty } );
            console.log( '' );
            VariableInspector.dump( { objectSimple: t.objectSimple } );
            console.log( '' );
            VariableInspector.dump( { date: t.date } );
            console.log( '' );
            VariableInspector.dump( { regex: t.regex } );
            console.log( '' );
            VariableInspector.dump( { functionSimple: t.functionSimple } );
            console.log( '' );
            VariableInspector.dump( { functionParams: t.functionParams } );
            console.log( '' );
            VariableInspector.dump( { class: t.class } );
            console.log( '' );
            VariableInspector.dump( { classInstance: t.classInstance } );
        }
        console.log( '' );
        VariableInspector.dump( {
            complexObject: {
                undefined: t.undefined,
                null: t.null,
                true: t.true,
                false: t.false,
                bigint: t.bigint,
                number: t.number,
                NaN: t.NaN,
                string: t.string,
                stringMultiline: t.stringMultiline,
                array: t.array,
                objectEmpty: t.objectEmpty,
                objectSimple: t.objectSimple,
                date: t.date,
                regex: t.regex,
                functionParams: t.functionParams,
            }
        } );
        console.log( '' );
    }
}
VariableInspector.TestClass = class {
    constructor () {
        this.property = 'property test _value';
        this._getSet = '_getSet test _value';
    }
    static methodName( param ) { return param; }
    get getSetProp() { return this._getSet; }
    set getSetProp( param ) { this._getSet = param; }
};
;
