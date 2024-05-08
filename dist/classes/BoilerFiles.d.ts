/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
 */
import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore } from './abstracts/AbstractCore.js';
import type { TsConfig } from '../types/jsonSchemas.js';
export type BoilerFileMethodKey = keyof BoilerFiles & ( "tsConfig" );
export interface BoilerFilesOpts extends AbstractCoreOpts {
    prettyPrint: boolean;
    tsConfig: {
        default: Partial<TsConfig>;
        presets: {
            universal: Partial<TsConfig>;
            astro: Partial<TsConfig>;
            node: Partial<TsConfig>;
            npm: Partial<TsConfig>;
        };
    };
}
export declare class BoilerFiles extends AbstractCore<BoilerFilesOpts> {
    #private;
    static get st(): BoilerFiles;
    get optsDefault(): BoilerFilesOpts;
    protected _getOpts( opts: Partial<BoilerFilesOpts> ): BoilerFilesOpts;
    constructor ( opts?: Partial<BoilerFilesOpts> );
    tsConfig( config?: Partial<TsConfig>, preset?: boolean | keyof BoilerFilesOpts[ 'tsConfig' ][ 'presets' ] ): TsConfig;
}
