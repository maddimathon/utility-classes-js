#!/usr/bin/env tsx
'use strict';
/**
 * Runs tests for the NodeFunctions class.
 * 
 * @package @maddimathon/utility-classes
 * @license MIT
 * 
 * @since 1.0.0
 */

import {
    NodeFunctions as NF,
    pageSeparator,
    separator,
    VariableInspector,
} from './.utilities.js';


pageSeparator( 'NodeFunctions' );


separator( 'PATHS' );
VariableInspector.dump( { "pathRelative('.scripts/tests')": NF.pathRelative( '.scripts/tests' ) } );
VariableInspector.dump( { "pathResolve('.scripts/tests')": NF.pathResolve( '.scripts/tests' ) } );


separator( 'GLOB' );
VariableInspector.dump( { "NF.glob( ['.scripts/tests/*'] )": NF.glob( [ '.scripts/tests/*' ] ) } );
VariableInspector.dump( { "NF.glob( ['.scripts/tests/*'], {}, true )": NF.glob( [ '.scripts/tests/*' ], {}, true ) } );


separator( 'FILES' );
const testFileContents = 'Hello there.  I am the contents of test1.txt.';
NF.log( `Writing '${ testFileContents }' from '.scripts/tests/.files/test1.txt'...`, { italic: true, } );
NF.writeFile( '.scripts/tests/.files/test1.txt', testFileContents );

VariableInspector.dump( { "NF.readFile('.scripts/tests/.files/test1.txt')": NF.readFile( '.scripts/tests/.files/test1.txt' ) } );

NF.log( `Copying '*.txt' from '.scripts/tests/.files' to '.scripts/tests/.files-copy'...`, { italic: true, } );
NF.copyFiles(
    '*.txt',
    '.scripts/tests/.files-copy',
    '.scripts/tests/.files',
);

const delGlobs = [
    '.scripts/tests/.files-copy',
    '.scripts/tests/.files/test1.txt',
    '.scripts/tests/.files/boiler-files',
];
NF.log( `Deleting ['${ delGlobs.join( `', '` ) }']...`, { italic: true, } );
NF.deleteFiles( delGlobs );


separator( 'BOILER FILES' );
NF.log( `Writing tsConfig boiler file...`, { italic: true, } );
NF.writeBoilerFile( '.scripts/tests/.files/boiler-files/tsConfig.json', 'tsConfig', {}, false );
NF.writeBoilerFile( '.scripts/tests/.files/boiler-files/universal/tsConfig.json', 'tsConfig', {}, true );
NF.writeBoilerFile( '.scripts/tests/.files/boiler-files/astro/tsConfig.json', 'tsConfig', {}, 'astro' );
NF.writeBoilerFile( '.scripts/tests/.files/boiler-files/node/tsConfig.json', 'tsConfig', {}, 'node' );
NF.writeBoilerFile( '.scripts/tests/.files/boiler-files/npm/tsConfig.json', 'tsConfig', {}, 'npm' );


separator( 'END', '165;44;50' );