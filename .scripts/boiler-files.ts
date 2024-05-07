#!/usr/bin/env tsx
'use strict';
/**
 * Writes boiler files for this project.
 * 
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @license MIT
 * 
 * @since {{PKG_VERSION}}
 */
// import argsFn from 'minimist';
// const args = argsFn( process.argv.slice( 2 ) );

import NodeFS from 'node:fs';
import NodePath from 'node:path';

// import { globSync } from 'glob';

// import pkg from '../package.json';

import { BoilerFiles } from '../src/index.js';

const BF: BoilerFiles = new BoilerFiles();


/**
 * jest
 */
NodeFS.writeFileSync(
    NodePath.resolve( 'jest.config.json' ),
    JSON.stringify( BF.jest( {} ), null, 4 ),
    { encoding: 'utf-8', }
);


/**
 * tsconfig
 */
NodeFS.writeFileSync(
    NodePath.resolve( 'tsconfig.json' ),
    JSON.stringify( BF.tsConfig( {
        include: [
            'src/**/*.ts',
        ],
        compilerOptions: {
            outDir: './dist',
        },
    }, 'node' ), null, 4 ),
    { encoding: 'utf-8', }
);