#!/usr/bin/env tsx
'use strict';
/**
 * Writes boiler files for this project.
 * 
 * @package @maddimathon/utility-classes
 * @license MIT
 * 
 * @since 1.0.0
 */
// import argsFn from 'minimist';
// const args = argsFn( process.argv.slice( 2 ) );

import NodeFS from 'node:fs';
import NodePath from 'node:path';

// import { globSync } from 'glob';

// import pkg from '../package.json';

import { NodeFunctions } from '../src/index.js';

const NF: NodeFunctions = new NodeFunctions();


/**
 * tsconfig
 */
NF.writeBoilerFile( 'tsconfig.json', 'tsConfig', {
    include: [
        'src/**/*.ts',
    ],
    compilerOptions: {
        outDir: './dist',
    },
}, 'node' );