/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore } from './abstracts/AbstractCore.js';
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
    multilineBreakVisualizers: boolean;
    multilineBreakVisualizerString: string;
    stringQuoteCharacter: string;
}
export declare class VariableInspector extends AbstractCore<VariableInspectorOpts> {
    static TestClass: {
        new(): {
            undefinedProperty: any;
            property: string;
            _getSet: string;
            getSetProp: string;
        };
        methodName( param: any ): any;
    };
    get optsDefault(): VariableInspectorOpts;
    protected readonly _name: string;
    protected readonly _rawValue: any;
    protected readonly _typeOf: ReturnType<VariableInspector[ 'typeOf' ]>;
    constructor ( variable: {
        [ key: number | string ]: any;
    }, opts?: Partial<VariableInspectorOpts> );
    protected _new( variableObj: ConstructorParameters<typeof VariableInspector>[ 0 ], optsOverride?: Partial<VariableInspectorOpts> ): VariableInspector;
    protected _objectToStrings( obj: {
        [ key: string ]: string | string[];
    }, brackets?: {
        open: string;
        close: string;
    }, _filterObjectKey?: boolean ): string;
    protected _addHangingIndent( convertMe: string, _indent?: number ): string;
    protected _filterObjectKey( key: any ): string;
    protected _filterType( type: string ): string;
    protected _filterValue( val: string | undefined, optsOverride: Partial<VariableInspectorOpts> ): VariableInspector[ '_value' ];
    protected _valueAsBoolean( optsOverride?: Partial<VariableInspectorOpts> ): string;
    protected _valueAsClass( optsOverride?: Partial<VariableInspectorOpts> ): string;
    protected _valueAsFunction( optsOverride?: Partial<VariableInspectorOpts> ): string;
    protected _valueAsNumber( optsOverride?: Partial<VariableInspectorOpts> ): string;
    protected _valueAsObject( optsOverride?: Partial<VariableInspectorOpts> ): string;
    protected _valueAsString( optsOverride?: Partial<VariableInspectorOpts> ): string;
    protected get _prefix(): string;
    protected get _type(): string;
    protected get _value(): string;
    dump(): void;
    toString(): string;
    valueOf(): string;
    static dump( ...params: ConstructorParameters<typeof VariableInspector> ): void;
    static stringify( ...params: ConstructorParameters<typeof VariableInspector> ): string;
    static test( verbose?: boolean ): void;
}
