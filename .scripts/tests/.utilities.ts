#!/usr/bin/env tsx
'use strict';
/**
 * Utility functions for testing.
 * 
 * @package @maddimathon/utility-classes
 * @license MIT
 * 
 * @since 1.0.0
 */



import {
    BuildUtilities as BuildUtilitiesClass,
    Functions as FunctionsClass,
    NodeFunctions as NodeFunctionsClass,
    VariableInspector,
} from '../../src/index.js';

export const BuildUtilities = new BuildUtilitiesClass();
export const Functions = new FunctionsClass();
export const NodeFunctions = new NodeFunctionsClass();

export function separator( title: string, clr: string = '121;60;150' ): void {

    const titlePaddingLength = title.length > 78 ? 0 : 80 - 2 - title.length;

    console.log( '' );
    console.log( '' );
    console.log( `\x1b[0m\x1b[48;2;${ clr };38;2;245;245;245;1m ${ title + ' '.repeat( titlePaddingLength ) } \x1b[0m` );
    console.log( `\x1b[0m\x1b[38;2;${ clr };1m` + '+'.repeat( 80 ) + `\x1b[0m` );
}

export function pageSeparator( title: string ): void {

    const titlePaddingLength = title.length > 118 ? 0 : 120 - 2 - title.length;

    console.log( '' );
    console.log( '' );
    console.log( '' );
    console.log( '' );
    console.log( `\x1b[0m\x1b[48;2;51;51;51;38;2;245;245;245;1m ${ title + ' '.repeat( titlePaddingLength ) } \x1b[0m` );
    console.log( `\x1b[0m\x1b[38;2;51;51;51;1m` + '='.repeat( 120 ) + `\x1b[0m` );
}

export { VariableInspector };