#!/usr/bin/env tsx
'use strict';
/**
 * Runs tests for the Functions class.
 * 
 * @package @maddimathon/utility-classes
 * @license MIT
 * 
 * @since 1.0.0
 */

import {
    Functions as F,
    pageSeparator,
    separator,
    VariableInspector,
} from './.utilities.js';


pageSeparator( 'Functions' );


separator( 'ARRAY REMOVE' );
const arrToRemove = [ 'a', 'b', 'c' ];
VariableInspector.dump( { 'arr': arrToRemove } );
VariableInspector.dump( { 'remove b': F.arrayRemove( arrToRemove, 'b' ) } );


separator( 'ARRAY UNIQUE' );
const arrToUnique = [ 'a', 'c', 'b', 'c' ];
VariableInspector.dump( { 'arr': arrToUnique } );
VariableInspector.dump( { 'unique arr': F.arrayUnique( arrToUnique ) } );
VariableInspector.dump( { 'arr': arrToUnique } );


separator( 'HANGING INDENT' );
const multilineString = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat\npellentesque dui eu tempus. Nunc mi leo, ultrices non odio et, egestas tempus\nligula. Quisque elementum venenatis ante eget ultrices. Donec faucibus\npellentesque leo. Integer malesuada urna massa, eget cursus velit euismod eu.\nCurabitur eleifend, nisl quis vehicula porta, tortor sem iaculis ipsum, sed\ntempor nibh tortor vitae dui. Maecenas congue odio porttitor odio egestas, non\nvolutpat augue molestie.`;
console.log( F.hangingIndent( multilineString ) );


separator( 'HARD TEXT WRAP' );
const longString = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat pellentesque dui eu tempus. Nunc mi leo, ultrices non odio et, egestas tempus ligula. Quisque elementum venenatis ante eget ultrices. Donec faucibus pellentesque leo. Integer malesuada urna massa, eget cursus velit euismod eu. Curabitur eleifend, nisl quis vehicula porta, tortor sem iaculis ipsum, sed tempor nibh tortor vitae dui. Maecenas congue odio porttitor odio egestas, non volutpat augue molestie.`;
console.log( F.hardTextWrap( 'Without indent | ' + longString, 80 ) );
console.log( '' );
console.log( F.hardTextWrap( 'With indent | ' + longString, 80, 8 ) );


separator( 'SLUGIFY' );
const stringToSlug = 'Test string to m/b slugify @ now!';
VariableInspector.dump( { 'string': stringToSlug } );
VariableInspector.dump( { 'slug  ': F.slugify( stringToSlug ) } );


separator( 'TO TITLE CASE' );
const stringToTransform = 'Test string to transform';
VariableInspector.dump( { 'string   ': stringToTransform } );
VariableInspector.dump( { 'uppercase': F.toTitleCase( stringToTransform ) } );


separator( 'DATESTAMPS' );
VariableInspector.dump( { 'datestamp': F.datestamp() } );
VariableInspector.dump( { 'datetimestamp': F.datetimestamp() } );
VariableInspector.dump( { 'timestamp': F.timestamp() } );


separator( 'MESSAGES' );
F.log( 'Test log string in red', { clr: 'red' } );
F.log( 'Test log string in orange flag', { clr: 'orange', flag: true, } );
F.log( 'Test log string in bold yellow', { clr: 'yellow', bold: true, } );
F.log( 'Test log string in italic green', { clr: 'green', italic: true, } );
F.log( 'Test log string in turquoise with an 8-space indent || ' + multilineString, { clr: 'turquoise', indent: 8, } );
F.log( 'Test log string in blue', { clr: 'blue' } );
F.log( 'Test log string in purple (1 lead-in lines)', { clr: 'purple', leadInLines: 1, } );
F.log( 'Test log string in pink (2 lead-out lines)', { clr: 'pink', leadOutLines: 2, } );
F.timestampLog( 'Test timestampLog string in black || ' + multilineString, { clr: 'black' } );
F.timestampLog( 'Test timestampLog string in grey', { clr: 'grey' } );
F.timestampLog( 'Test timestampLog string in white flag', { clr: 'white', flag: true, } );


separator( 'END', '165;44;50' );