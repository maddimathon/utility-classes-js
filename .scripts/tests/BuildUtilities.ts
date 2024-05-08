#!/usr/bin/env tsx
'use strict';
/**
 * Runs tests for the BuildUtilities class.
 * 
 * @package @maddimathon/utility-classes
 * @license MIT
 * 
 * @since 1.0.0
 */

import type {
    NoticeStage,
} from '../../src/index.js';

import {
    NodeFunctions as NF,
    BuildUtilities as BU,
    pageSeparator,
    separator,
    VariableInspector,
} from './.utilities.js';


pageSeparator( 'BuildUtilities' );


separator( 'PROPS' );
VariableInspector.dump( { 'pkgName': BU.pkgName } );


separator( 'CACHING' );
VariableInspector.dump( { 'cacheSet()': BU.cacheSet( 'test-cache', 'Test cache value.' ) } );
VariableInspector.dump( { 'cacheGet()': BU.cacheGet( 'test-cache' ) } );
VariableInspector.dump( { 'cacheDel()': BU.cacheDel( 'test-cache' ) } );


separator( 'PROGRESS LOG' );
BU.progressLog( 'test' );


separator( 'END', '165;44;50' );