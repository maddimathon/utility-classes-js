/**
 * A class for inspecting meta-information about variables.
 *
 * It got too messy trying to include a function in the `Functions` class.  This
 * is mostly useful when you won’t be using a console with better built-in
 * debugging options; I print the results to the terminal, mostly.  It might
 * also be useful for automating basic documentation.
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
//UPGRADE - improve class & instance output info -- differentiate prototype & getters/setters
//UPGRADE - upgrade function parsing -- look into potential libraries

import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore, AbstractCoreOptsDefault } from './abstracts/AbstractCore.js';



/** # TYPES
 ** ======================================================================== **/

/**
 * Options for instances of VariableInspector class.
 */
export interface VariableInspectorOpts extends AbstractCoreOpts {

    includeEquals: boolean;
    includeType: boolean;
    includeValue: boolean;

    includeFunctionContents: boolean;
    includePrototypeDescriptors: boolean;
    includeDefaultPrototypeDescriptors: boolean;
    includePrototypeInspection: boolean;

    localizeDates: boolean;
    localizeNumbers: boolean;

    /**
     * Adds this.multilineBreakVisualizerString to the start & end of multiline line breaks( multiline strings have a hanging indent added for display).
     */
    multilineBreakVisualizers: boolean;
    multilineBreakVisualizerString: string;

    stringQuoteCharacter: string;
}



/** # CLASSES
 ** ======================================================================== **/

/**
 * A class with tools to debug unknown vairiables, especially on the command
 * line.
 *
 * One instance per variable, or use the static functions for one-time use.
 */
export class VariableInspector extends AbstractCore<VariableInspectorOpts> {

    static TestClass = class {

        public undefinedProperty: any;
        public property = 'property test _value';

        static methodName( param: any ) { return param; }

        _getSet = '_getSet test _value';
        get getSetProp() { return this._getSet; }
        set getSetProp( param: string ) { this._getSet = param; }
    };



    /** LOCAL
     ** ======================================================================== **/

    public get optsDefault(): VariableInspectorOpts {

        return {
            ...AbstractCoreOptsDefault,

            includeEquals: true,
            includeType: true,
            includeValue: true,

            includeFunctionContents: false,
            includePrototypeDescriptors: true,
            includeDefaultPrototypeDescriptors: false,
            includePrototypeInspection: false,

            localizeDates: false,
            localizeNumbers: true,

            multilineBreakVisualizers: false,
            multilineBreakVisualizerString: '⠀',

            stringQuoteCharacter: '"',
        };
    }

    /**
     * Value’s name, used in output.
     */
    protected readonly _name: string;

    /**
     * Value to inspect.
     */
    protected readonly _rawValue: any;

    /**
     * Alias for this.typeOf( this._rawValue ).
     */
    protected readonly _typeOf: ReturnType<VariableInspector[ 'typeOf' ]>;


    /**
     * CONSTRUCTOR
     * 
     * @param variable  Pass the variable as the only property of an object, 
     *                  where the key is its name.
     * @param opts      
     */
    constructor (
        variable: { [ key: number | string ]: any; },
        opts: Partial<VariableInspectorOpts> = {},
    ) {
        super( opts );

        if ( Object.keys( variable ).length == 1 ) {
            // = passed correctly
            this._name = Object.keys( variable )[ 0 ];
            this._rawValue = variable[ this._name ];
        } else {
            // = assume it was passed wrong
            this._name = 'variable';
            this._rawValue = variable;
        }

        this._typeOf = this.typeOf( this._rawValue );
    }


    /**
     * Returns an instance of this class that inherits this instances’s opts.
     * Meant for displaying inspected values as a child of this inspection.
     */
    protected _new(
        variableObj: ConstructorParameters<typeof VariableInspector>[ 0 ],
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): VariableInspector {

        return new VariableInspector(
            variableObj,
            this._getOpts( {
                includeEquals: false,
                includeValue: true,
                ...optsOverride,
            } )
        );
    }



    /** FORMATTING VALUES
     ** ==================================================================== **/

    /**
     * Converts an object with key: _value pairs into an array of strings for
     * inspecting.
     */
    protected _objectToStrings(
        obj: { [ key: string ]: string | string[]; },
        brackets: { open: string, close: string; } = { open: '{', close: '}' },
        _filterObjectKey: boolean = true,
    ): string {
        const objKeyFilter: boolean = _filterObjectKey;

        /** 
         * @const contents  Object `obj` converted to `key: value` strings. 
         *                  Joined then split by new lines.
         */
        const contents: string[] = Object.keys( obj ).map(
            ( _key: string ): string => {
                const key = _key as keyof typeof obj;

                /** @var filteredKey  Filtered key value. */
                const filteredKey: string = objKeyFilter
                    ? this._filterObjectKey( key )
                    : `${ key }`;

                /** @var value  Value to print as a string. */
                const value: string = Array.isArray( obj[ key ] )
                    ? ( obj[ key ] as string[] ).join( `\n` )
                    : obj[ key ] as string;

                /**
                 * RETURN
                 */
                return `${ filteredKey }: ${ value }`;
                // return this._addHangingIndent(
                //     `${ filteredKey }: ${ value }`.split( `\n` ),
                //     filteredKey.length
                // ).join( `\n` );
            }
        ).join( `\n` ).split( `\n` );


        /** @const allContentIsEmpty  If all content is (functionally) empty. */
        const allContentIsEmpty: boolean
            = contents.length < 1 || contents.every(
                ( val: string ): boolean => {
                    return Boolean(
                        val.match( /^[\s\n]*$/gis )
                        || val.length < 1
                    );
                }
            );

        /**
         * RETURN
         */
        return (
            allContentIsEmpty
                ? [ brackets.open + brackets.close ] // = no contents
                : [
                    brackets.open,
                    ...contents.map( line => `${ this.tab }${ line }` ),
                    brackets.close,
                ]
        ).join( `\n` );
    }


    /** String Filters ==================================== **/
    /** A bunch of methods to format strings for predictable output. */

    /**
     * Adds an indent after every new line.
     * 
     * @param convertMe  
     * @param indent     Optional. Default `this.tab`.
     * 
     * @return  The same text, but with an indent added after every new line.
     * 
     * @see Functions#tab  Default for `indent` param.
     */
    protected _addHangingIndent(
        convertMe: string,
        _indent: number = this.opts.tabWidth,
    ): string {
        const indent: string = this.opts.tabCharacter.repeat( _indent );

        return convertMe.split( `\n` ).map(
            ( item: string, index: number ): string => {
                if ( index === 0 ) { return item; }
                return `${ indent }${ item }`;
            }
        ).join( `\n` );
    }

    /**
     * A string representation of the key passed.  
     * Format varies by type.
     */
    protected _filterObjectKey( key: any ): string {

        switch ( typeof key ) {

            case 'function':
                return `{${ key() }}`;

            case 'number':
                return key.toString();

            case 'string':
                if (
                    String( Number( key ) ) === key
                    && String( Number( key ) ) !== 'NaN'
                ) {
                    return this._filterObjectKey( Number( key ) );
                }
                return `"${ key }"`;

            case 'symbol':
                return `@@${ key.description ?? String( key ) }`;
        }

        const keyVI = this._new( { key }, {
            includeEquals: false,
        } );
        return `[${ keyVI.toString() }]`;
    }

    /**
     * Returns a string formatted for type output.
     */
    protected _filterType( type: string ): string { return `<${ type }>`; }


    /** Value Representation Helpers ==================================== **/

    protected _filterValue(
        val: string | undefined,
        optsOverride: Partial<VariableInspectorOpts>,
    ): VariableInspector[ '_value' ] {
        // const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );
        return val ?? '';
    }

    protected _valueAsBoolean(
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): string {
        const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );

        return this._filterValue(
            this._rawValue.toString().toUpperCase(),
            localOpts,
        );
    }


    protected _valueAsClass(
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): string {
        const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );

        return this._filterValue(
            [
                this._rawValue.name,
                this._valueAsObject( {
                    ...optsOverride,
                    includeType: false,
                    includePrototypeInspection: true,
                } ),
            ].join( ' ' ),
            localOpts,
        );
    }


    protected _valueAsFunction(
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): string {
        const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );
        const rawValueAsString: string = this._rawValue.toString();

        /** @var regexPatterns  String patterns for constructing RegExps. */
        const regexPatterns: { [ key: string ]: string; } = {
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

        /** @var regexPatterns  RegExps for parsing function strings. */
        const regExps: { [ key: string ]: RegExp; } = {
            fnContent: new RegExp(
                [
                    '^.*?',
                    regexPatterns[ 'fnContent' ],
                    '\s*$',
                ].join( '' ),
                'gis'
            ),
            params: new RegExp(
                [
                    '^',
                    [
                        '(((function|get|set)\\s+)?',
                        regexPatterns[ 'fnName' ],
                        '(?=\\s*\\())?',
                    ].join( '' ), // optional fn name that might be prepended
                    `\\(?${ regexPatterns[ 'params' ] }\\)?`, // params
                    '(=>)?', // arrow function symbol
                    regexPatterns[ 'fnContent' ], // function braces & contents
                    '$',
                ].join( '\\s*' ),
                'gis'
            ),
        };


        /**
         * Get params & prefix
         */

        /** @var paramsArray  Params string split by comma. */
        const paramsArray: string[] = rawValueAsString
            .replace( regExps[ 'params' ], '$5' )
            .split( /\s*,\s*/gi );

        /** @var params  Params as a formatted string. */
        const params: string = (
            paramsArray.length < 1
                ? ''
                : paramsArray.join( ', ' )
        ).replace( /^\s+$/gi, '' ).replace( /(?<!\s)=(?!\s)/gi, ' = ' );

        /** @var fullPrefix  Prefix to function content, including params. */
        const fullPrefix: string = [
            this._rawValue.name ?? this._name,
            `(${ params.length > 0 ? ` ${ params } ` : '' })`,
        ].join( '' );


        /**
         * @var content  Function’s content.
         */
        const content: string[]
            = rawValueAsString.replace( regExps.fnContent, '$1' ).split( ';' );


        /**
         * Final filter to format the content variable.
         */
        const returnFilter = ( cn: string[] ): string => {

            if ( !localOpts.includeFunctionContents ) { return ''; }
            if ( cn.length < 1 ) { return '{}'; }
            if ( cn.length === 1 ) { return `{ ${ cn.join( '; ' ) }; }`; }

            return [
                '{',
                ...cn.map( line => `${ this.tab }${ line };` ),
                '}',
            ].join( `\n` );
        };


        /**
         * RETURN
         */
        return this._filterValue(
            [
                fullPrefix,
                returnFilter( content ),
            ].join( ' ' ),
            localOpts,
        );
    }


    protected _valueAsNumber(
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): string {
        const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );

        const localNumber = localOpts.localizeNumbers
            ? this._rawValue.toLocaleString()
            : this._rawValue.toString();

        return this._filterValue( localNumber, localOpts );
    }


    protected _valueAsObject(
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): string {
        const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );
        const thisRawValue = this._rawValue;

        /** @const thisValuePrototype  Appropriate prototype for this object. */
        const thisValuePrototype = this._typeOf === 'class'
            ? ( thisRawValue as Function ).prototype ?? thisRawValue
            : (
                thisRawValue.prototype
                ?? Object.getPrototypeOf( thisRawValue )
                ?? thisRawValue.constructor?.prototype
                ?? thisRawValue
            );

        /** @var inspectedObj  Input obj as keys & strings for display. */
        let inspectedObj: { [ key: string ]: string | string[]; } = {};

        /**
         * String inspection for this object’s values.
         * 
         * @param value               
         * @param key                 
         * @param filterOptsOverride  
         * 
         * @return  Inspection string for the given property/key value.
         */
        const childInspection = (
            value: any,
            key: string = '_',
            filterOptsOverride: Partial<VariableInspectorOpts> = {},
        ): string => {

            /** @const valueType */
            const valueType = this.typeOf( value );

            let includeValue = true;
            switch ( valueType ) {

                case 'class':
                    // case 'function':
                    includeValue = false;
                    break;
            }

            return this._new( { [ key ]: value }, {
                ...localOpts,
                includeEquals: false,
                includeValue: includeValue,
                ...filterOptsOverride,
            } ).toString();
        };

        /**
         * Filters and formats values to add to 
         * `inspectedObj`.
         * 
         * @param p 
         * @param p.key        
         * @param p.keyFilter  Function to filter key value for output.
         * 
         * @return  Object with key & string props to add to `inspectedObj`.
         */
        const propertyInspector = ( p: {
            key: keyof typeof thisRawValue,
            keyFilter?: ( k: keyof typeof thisRawValue ) => string,
        } ): {
            key: number | string;
            value: string;
        } | false => {

            /** 
             * @const propertyDescriptor  Property descriptor for this prop.
             */
            const propertyDescriptor
                = Object.getOwnPropertyDescriptor( thisRawValue, p.key )
                ?? Object.getOwnPropertyDescriptor( thisValuePrototype, p.key )
                ?? {};

            /** 
             * @const thisProperty  Value to inspect.
             */
            const thisProperty = thisRawValue[ p.key ]
                ?? thisValuePrototype[ p.key ]
                ?? propertyDescriptor.value;

            /**
             * @const typeOfThisProperty  Simple type for this prop.
             */
            const typeOfThisProperty = this.typeOf( thisProperty );

            /**
             * RETURN
             * 
             * Sometimes we should force-exclude the default `Object` prototype
             * descriptors.
             * 
             * Prototypes are also ignored at this stage.
             */
            if (
                p.key === 'prototype' || p.key === '__proto__'
                || ( !localOpts.includeDefaultPrototypeDescriptors
                    && (
                        ( thisProperty instanceof Object
                            && (
                                p.key === 'constructor'
                                || p.key === '__defineGetter__'
                                || p.key === '__defineSetter__'
                                || p.key === '__lookupGetter__'
                                || p.key === '__lookupSetter__'
                                || p.key === 'hasOwnProperty'
                                || p.key === 'isPrototypeOf'
                                || p.key === 'propertyIsEnumerable'
                                || p.key === 'toLocaleString'
                                || p.key === 'toString'
                                || p.key === 'valueOf'
                            ) )
                        || ( Array.isArray( thisProperty )
                            && (
                                p.key === 'at'
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
                                || p.key === 'with'
                            ) )
                    ) )
            ) {
                return false;
            }

            /**
             * Builds the return object.
             */
            const returnObjBuilder = (
                val: string,
                valType: ReturnType<VariableInspector[ 'typeOf' ]>,
            ): Exclude<ReturnType<typeof propertyInspector>, false> => {

                const key = typeof p.keyFilter === 'function'
                    ? p.keyFilter( p.key )
                    : this._filterObjectKey( p.key );

                /**
                 * Add hanging indent to multiline strings.
                 */
                if ( valType === 'string' ) {
                    val = this._addHangingIndent(
                        val,
                        key.length + 2
                    );
                }

                return {
                    key: key,
                    value: val,
                };
            };

            /**
             * RETURN
             * If it’s a constructor, we don’t need its contents, just a type
             * display.
             */
            if ( p.key === 'constructor' && typeOfThisProperty === 'class' ) {
                return returnObjBuilder(
                    this._filterType( 'constructor' ),
                    typeOfThisProperty,
                );
            }

            /**
             * RETURN
             * If this is a getter/setter.
             */
            if ( propertyDescriptor.get || propertyDescriptor.set ) {

                /** Written once, run twice. */
                const valueBuilder = ( v: "get" | "set" ): undefined | string => {
                    return propertyDescriptor[ v ] && `└─ ${ childInspection(
                        propertyDescriptor[ v ],
                        '_',
                        { includeType: false, }
                    ) }`;
                };

                return returnObjBuilder(
                    this._addHangingIndent(
                        (
                            [
                                ' ',
                                valueBuilder( 'get' ),
                                valueBuilder( 'set' ),
                            ] as ( string | false )[]
                        ).filter( l => l !== false ).join( `\n` ),
                        localOpts.tabWidth
                    ),
                    typeOfThisProperty,
                );
            }

            /**
             * RETURN
             */
            return returnObjBuilder(
                childInspection( thisProperty ),
                typeOfThisProperty,
            );
        };


        /**
         * OBJECT KEYS
         */
        /** @var objectKeys  Keys for own properties. */
        const objectKeys: ( keyof typeof thisRawValue & string )[]
            = Object.keys(
                thisRawValue
            ) as ( keyof typeof thisRawValue & string )[];

        /** Add these keys & values to the inspected thisRawValue */
        for ( const key of objectKeys ) {

            const inspectedStrings = propertyInspector( { key } );

            if ( inspectedStrings === false ) { continue; }

            inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
        }


        /**
         * INSTANCE PROPERTY SYMBOLS
         */
        /** @var propertySymbols  Keys for own property symbols. */
        const propertySymbols: ( keyof typeof thisRawValue & symbol )[]
            = Object.getOwnPropertySymbols( thisRawValue ) as ( keyof typeof thisRawValue & symbol )[];

        /** Add these keys & values to the inspected thisRawValue */
        for ( const key of propertySymbols ) {

            const inspectedStrings = propertyInspector( { key } );
            if ( inspectedStrings === false ) { continue; }

            if (
                !objectKeys.includes( String( key ) as keyof typeof thisRawValue & string )
            ) {
                inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
            }
        }


        /**
         * INSTANCE PROPERTY NAMES
         */
        /** @var propertyNames  Keys for own property names. */
        const propertyNames: ( keyof typeof thisRawValue & string )[]
            = Object.getOwnPropertyNames( thisRawValue ) as ( keyof typeof thisRawValue & string )[];

        /** Add these keys & values to the inspected thisRawValue */
        for ( const key of propertyNames ) {

            const inspectedStrings = propertyInspector( {
                key,
                keyFilter: ( k ) => `[${ this._filterObjectKey( k ) }]`,
            } );

            if ( inspectedStrings === false ) { continue; }

            if (
                !objectKeys.includes( key )
                && !(
                    Object.keys( inspectedObj ).includes( this._filterObjectKey( key ) )
                    && typeof key === 'symbol'
                )
            ) {
                inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
            }
        }


        /**
         * INSTANCE PROPERTY DESCRIPTORS
         */
        /** @var propertyDescs  Object of own property descriptors. */
        const propertyDescs = Object.getOwnPropertyDescriptors( thisRawValue );

        /** @var propertyDescs  Object of own property descriptors. */
        let propDescsKeyArray: ( keyof typeof thisRawValue )[] = [];

        /** Add these keys & values to the inspected thisRawValue */
        for ( const _key in propertyDescs ) {
            const key = _key as keyof typeof thisRawValue;

            const inspectedStrings = propertyInspector( {
                key,
                keyFilter: ( k ) => `[${ this._filterObjectKey( k ) }]`,
            } );

            propDescsKeyArray.push( key );

            if ( inspectedStrings === false ) { continue; }

            /** @const keyString  Key as a string, without added formatting. */
            const keyString
                = String( key ) as keyof typeof thisRawValue & string;

            if (
                !objectKeys.includes( keyString )
                && !propertyNames.includes( keyString )
                && !(
                    Object.keys( inspectedObj ).includes(
                        this._filterObjectKey( key )
                    )
                    && typeof key === 'symbol'
                )
            ) {
                inspectedObj[ inspectedStrings.key ] = inspectedStrings.value;
            }
        }


        /**
         * PROTOTYPE NAMES & SYMBOLS
         */
        /** @var prototypeNames  Keys for own properties. */
        const prototypeNames = Object.getOwnPropertyNames( thisValuePrototype );

        /** @var prototypeSymbols  Keys for own properties. */
        const prototypeSymbols = Object.getOwnPropertySymbols( thisValuePrototype );

        /** Add these keys & values to the inspected thisRawValue */
        if ( localOpts.includePrototypeDescriptors && (
            Boolean(
                thisRawValue.constructor?.name === 'Array'
                || thisRawValue.constructor?.name === 'Function'
                || thisRawValue.constructor?.name === 'Object'
                || thisRawValue.constructor?.name === 'String'

            ) === false // = if it is NOT a default thisValuePrototype
            || localOpts.includeDefaultPrototypeDescriptors // = OR if we want to include default prototypes
        ) ) {
            for ( const keySet of [ prototypeNames, prototypeSymbols, ] ) {

                for ( const _key of keySet ) {
                    const key = _key as keyof typeof thisRawValue;

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

                    if ( inspected === false ) { continue; }

                    /** @const keyString  Key as a string, w/o formatting. */
                    const keyString
                        = String( key ) as keyof typeof thisRawValue & string;

                    if (
                        !objectKeys.includes( keyString )
                        && !propertyNames.includes( keyString )
                        && !(
                            Object.keys( inspectedObj ).includes(
                                this._filterObjectKey( key )
                            )
                            && typeof key === 'symbol'
                        )
                        && !propDescsKeyArray.includes( key )
                    ) {
                        inspectedObj[ inspected.key ]
                            = inspected.value;
                    }
                }
            }
        }

        /**
         * Include the thisValuePrototype by option
         */
        if ( localOpts.includePrototypeInspection ) {

            const prototypeVI = this._new(
                { [ `${ this._name }.prototype` ]: thisValuePrototype },
                {
                    ...localOpts,
                    includeEquals: false,
                    includePrototypeDescriptors: true,
                    includePrototypeInspection: false,
                    // includeType: true,
                }
            );

            if ( prototypeVI._value !== undefined ) {
                inspectedObj[ '<prototype>' ] = prototypeVI._value;
            }
        }

        /**@const brackets */
        const brackets = this._type === 'Array'
            ? { open: '[', close: ']' }
            : { open: '{', close: '}' };


        /**
         * RETURN
         */
        inspectedObj = Object.values( inspectedObj ).length > 0
            ? {
                ...inspectedObj,
                // '(objKeys     )': objectKeys.length < 1
                //     ? '[]'
                //     : `[ ${ objectKeys.map( s => this._filterObjectKey( s ) ).join( ', ' ) } ]`,
                // '(propSymbols )': propertySymbols.length < 1
                //     ? '[]'
                //     : `[ ${ propertySymbols.map( s => this._filterObjectKey( s ) ).join( ', ' ) } ]`,
                // '(propNames   )': propertyNames.length < 1
                //     ? '[]'
                //     : `[ ${ propertyNames.map( s => this._filterObjectKey( s ) ).join( ', ' ) } ]`,
                // '(propDescs   )': propDescsKeyArray.length < 1
                //     ? '[]'
                //     : `[ ${ propDescsKeyArray.map( s => this._filterObjectKey( s ) ).join( ', ' ) } ]`,
                // '(protoNames  )': prototypeNames.length < 1
                //     ? '[]'
                //     : `[ ${ prototypeNames.map( s => this._filterObjectKey( s ) ).join( ', ' ) } ]`,
                // '(protoSymbols)': prototypeSymbols.length < 1
                //     ? '[]'
                //     : `[ ${ prototypeSymbols.map( s => this._filterObjectKey( s ) ).join( ', ' ) } ]`,
            }
            : inspectedObj;
        return this._filterValue(
            this._objectToStrings( inspectedObj, brackets, false ),
            localOpts,
        );
    }


    protected _valueAsString(
        optsOverride: Partial<VariableInspectorOpts> = {},
    ): string {
        const localOpts: VariableInspectorOpts = this._getOpts( optsOverride );
        const rawValue = this._rawValue as string;

        /** @var isMultiline  If string is multiline. */
        const isMultiline: boolean = Boolean( rawValue.match( `\n` ) );

        /** @var includeLineVisualizers  If to include multiline visualizers. */
        const includeLineVisualizers: boolean
            = localOpts.multilineBreakVisualizers && isMultiline;

        /** @var quote  String to use as a quote for output. */
        const quote: string = includeLineVisualizers
            ? ''
            : localOpts.stringQuoteCharacter;


        /** 
         * Escapes the string to return it.
         */
        const returnEscape = ( str: string ): string => {

            /** 
             * Adds visualizers to each line as 
             *                            appropriate and a hanging indent.
             */
            const multilineFilter = ( _str: string ): string => {
                if ( !isMultiline ) { return _str; }
                const str: string = _str;

                /** @var lineVisualizer  Local copy for brevity. */
                const lineVisualizer = localOpts.multilineBreakVisualizerString;

                /** @var tmpStr  Temp split of the string to add visualizers */
                let tmpStr: string[] = str.split( `\n` );

                /** @var arr  Split of the string by new lines. */
                const arr: string[] = includeLineVisualizers
                    ? tmpStr.map(
                        ( str: string ) => lineVisualizer + str + lineVisualizer
                    )
                    : tmpStr;

                /** @var indentWidth  For hanging indent. */
                const indentWidth: number = [

                    this._prefix.length > 0
                        ? this._prefix.length + 1
                        : this._prefix.length,

                    quote.length,
                    includeLineVisualizers ? lineVisualizer.length : 0,

                    localOpts.includeType
                        ? this._filterType( this._type ).length + 1
                        : 0,

                ].reduce(
                    ( prev: number, curr: number ): number => prev + curr
                );

                /** RETURN **/
                return this._addHangingIndent( arr.join( `\n` ), indentWidth );
            };

            return multilineFilter(
                // escaping the string for hex esc sequence
                decodeURI( encodeURI( str ).replace( /%1B/g, '\\x1b' ) )
            );
        };


        /**
         * RETURN
         */
        return this._filterValue(
            quote + returnEscape( rawValue ) + quote,
            localOpts,
        );
    }



    /** PRIVATE GETTERS
     ** ==================================================================== **/

    /**
     * Prefix to print, not including the type.
     */
    protected get _prefix(): string {

        /** Filters the return value */
        const returnFilter = ( str: string ) => {
            return str.replace( /(^[\n\s]+|[\n\s]+$)/gi, '' );
        };

        /**
         * If the type wasn’t passed, get the typeof the passed variable
         * and append the post type as appropriate
         */
        const basePrefix: string = ( [

            this.opts.includeEquals && `${ this._name } =`,

        ] as ( false | string )[] )
            .filter( v => v !== false && v.length > 0 )
            .join( ' ' );


        /**
         * IF VALUE IS STRING
         */
        if ( this._typeOf === 'string' ) {
            const rawValue: string = this._rawValue as string;

            /**
             * Length of padding to include after the 
             *                          prefix for proper alignment.
             * 
             * @param ind  String to use as an this.tab for all lines.
             * @param pre  String to use as a prefix.
             * 
             * @return  Number of chars needed to get this.tab to match prefix
             */
            const paddingLength = ( ind: string, pre: string ): number => {

                return ( [

                    ind.length - pre.length - 1,
                    this.opts.includeType
                        ? this._filterType( this._type ).length
                        : false,

                ] as ( false | number )[] )
                    .reduce(
                        ( prev: number | false, curr: number | false ): number => {
                            return curr === false ? prev || 0 : ( prev || 0 ) + curr;
                        }
                    ) as number;
            };

            /** @var indent  String to use as an indent -- adjusted below. */
            let indent: string = this.tab;

            /**
             * Correct if the lead-in needs even more indent space (we need at
             * least two characters for space & quote before the string starts)
             */

            /** @const minimumPadding  Minimum padding needed. */
            const minimumPadding: number = (
                1
            ) + this.opts.stringQuoteCharacter.length;

            while ( paddingLength( indent, basePrefix ) < minimumPadding ) {
                indent = indent + this.opts.tabCharacter;
            }

            /** @const paddingBuffer  String representation of the buffer. */
            const paddingBuffer: string = this.opts.tabCharacter.repeat(
                paddingLength( indent, basePrefix )
            );

            /** @const returnVal */
            const returnVal: string = rawValue.match( /\n/g )
                ? ( basePrefix + paddingBuffer ).replace(
                    new RegExp( '.'.repeat( minimumPadding ) + '$', 'gi' ),
                    ''
                )
                : basePrefix;

            /** RETURN **/
            return returnFilter( returnVal );
        }

        /**
         * FALLBACK
         */
        return returnFilter( basePrefix );
    }

    /**
     * String for variable type. NOT filtered for output.
     */
    protected get _type(): string {

        /** Filters the return value */
        const returnFilter = ( str: string ) => {
            return str.replace( /(^[\n\s]+|[\n\s]+$)/gi, '' );
        };

        switch ( this._typeOf ) {

            case 'NaN':
                return returnFilter( typeof Number.NaN );

            case 'object':
                const constructorName = this._rawValue.constructor?.name;
                return returnFilter(
                    constructorName === 'Object'
                        ? 'object'
                        : constructorName
                );
        }
        return returnFilter( this._typeOf );
    }

    /**
     * Representation of the variable’s _value to print -- includes _type.
     */
    protected get _value(): string {

        /**
         * Returns a string formatted to represent the 
         * value-getting method. (e.g., when using a fallback)
         */
        const via = ( viaMethod: string ): string => `<via ${ viaMethod }>`;


        /**
         * PARSE BY TYPE
         */
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

                    /**
                     * DATE
                     */
                    case 'Date':
                        const date = this._rawValue as Date;
                        return this._filterValue(
                            this.opts.localizeDates
                                ? date.toLocaleString( 'en-CA' )
                                : date.toString(),
                            {}
                        );

                    /**
                     * toString() classes
                     */
                    case 'RegExp':
                        const regex = this._rawValue as RegExp;
                        return this._filterValue( regex.toString().replace( /\\/g, '\\\\' ), {} );
                }
                return this._valueAsObject();

            case 'string':
                return this._valueAsString();
        }


        /**
         * FALLBACK
         * Check for string-ing methods
         */
        for ( const fn of [
            'toString',
            'stringify',
        ] ) {

            if ( typeof this._rawValue[ fn ] === 'function' ) {

                const fnReturn = this._rawValue[ fn ]();

                if ( typeof fnReturn === 'string' ) {

                    return this._filterValue(
                        [
                            via( `.${ fn }()` ),
                            this._addHangingIndent(
                                fnReturn,
                                this.opts.tabWidth
                            ),
                        ].join( ' ' ),
                        {},
                    );
                }
            }
        }


        /**
         * FALLBACK
         * Interpolation
         */
        return this._filterValue(
            `${ via( 'interpolation' ) } ${ this._rawValue }`,
            {}
        );
    }



    /** PUBLIC METHODS
     ** ==================================================================== **/

    /**
     * Print the contents to the console.
     */
    public dump(): void {
        return console.log( this.toString() );
    };

    /**
     * Overwrites the default function to return a string 
     *                   representation of thevariable’s _value.
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
     */
    public override toString(): string {

        return (
            [
                this._prefix,
                this.opts.includeType && this._filterType( this._type ),
                this.opts.includeValue && this._value,
            ] as ( false | string )[]
        ).filter(
            ( val: false | string ) => val !== false && val.length > 0
        ).join( ' ' );
    }

    /**
     * Overwrites the default function to return a string.
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
     */
    public override valueOf(): string { return this.toString(); }



    /** STATIC METHODS
     ** ==================================================================== **/

    /**
     * Alias for `new VariableInspector( ...).dump()`.
     */
    public static dump(
        ...params: ConstructorParameters<typeof VariableInspector>
    ): void {
        const vi = new VariableInspector( ...params );
        return vi.dump();
    }

    /**
     * Alias for `new VariableInspector( ...).toString()`.
     */
    public static stringify(
        ...params: ConstructorParameters<typeof VariableInspector>
    ): string {
        const vi = new VariableInspector( ...params );
        return vi.toString();
    }


    /** Testing ==================================== **/

    /**
     * Prints test output to the console via VariableInspector.dump().
     */
    public static test( verbose: boolean = false ) {

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

            functionSimple: (): string => { return 'hello'; },
            functionParams: (
                value1: string,
                value2: string,
            ): string => { const test = value2; return test + value1; },

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
};