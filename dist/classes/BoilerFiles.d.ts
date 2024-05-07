/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */
import type { Config as JestConfig } from 'jest';
import type { AbstractCoreOpts } from './abstracts/AbstractCore.js';
import { AbstractCore } from './abstracts/AbstractCore.js';
import type { TsConfig } from '../types/jsonSchemas.js';
interface BoilerFilesOpts extends AbstractCoreOpts {
    prettyPrint: boolean;
    jest: {
        default: JestConfig;
    };
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
type BoilerFileMethodKey = keyof BoilerFiles & ("jest" | "tsConfig");
declare class BoilerFiles extends AbstractCore<BoilerFilesOpts> {
    #private;
    static get st(): BoilerFiles;
    get optsDefault(): BoilerFilesOpts;
    constructor(opts?: Partial<BoilerFilesOpts>);
    jest(config?: Partial<JestConfig>): JestConfig;
    tsConfig(config?: Partial<TsConfig>, preset?: boolean | keyof BoilerFilesOpts['tsConfig']['presets']): TsConfig;
}
export type { BoilerFileMethodKey, BoilerFilesOpts, };
export { BoilerFiles, };
