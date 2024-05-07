/**
 * Types for various JSON file schemas.  Especially helpful for
 * constructing/parsing them in scripts.
 *
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @author Maddi Mathon (www.maddimathon.com)
 * @link {{CURRENT_URL}}
 *
 * @license MIT
 *
 * @since {{PKG_VERSION}}
 */
/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */



/** # NPM/NODE
 ** ======================================================================== **/

/**
 * @interface PackageJson
 * Last updated 2024-02-17
 * @link https://docs.npmjs.com/cli/v10/configuring-npm/package-json
 */
interface PackageJson {

    name: string;
    version: string;
    description?: string;
    keywords?: string[];

    homepage?: string;
    bugs?: {
        url?: string;
        email?: string;
    };
    license?: string;

    author?: string | { name: string; email?: string; url?: string; };
    contributors?: PackageJson[ 'author' ][];
    funding?: string | { type: string; url: string; } | ( string | { type: string; url: string; } )[];

    files?: string[];
    main?: string;
    browser?: string;
    bin?: string | { [ key: string ]: string; };
    man?: string | string[];
    directories?: { [ key: string ]: string; };

    repository?: string | { type: string; url: string; directory?: string; };

    scripts?: { [ key: string ]: string; };

    config?: { [ key: number | string ]: any; };

    dependencies?: { [ key: string ]: string; };
    devDependencies?: { [ key: string ]: string; };

    peerDependencies?: { [ key: string ]: string; };
    peerDependenciesMeta?: { [ key: string ]: { [ key: string ]: string; }; };

    bundleDependencies?: string[];
    optionalDependencies?: { [ key: string ]: string; };
    overrides?: { [ key: string ]: string | PackageJson[ 'overrides' ]; };

    engines?: { [ key: string ]: string; };
    os?: string[];
    cpu?: string[];

    private?: boolean;
    publishConfig?: { [ key: string ]: boolean | number | string; };
    workspaces?: string[];
}



/** # TYPESCRIPT
 ** ======================================================================== **/

/**
 * A valid TsConfig object.
 * 
 * @link https://www.typescriptlang.org/tsconfig
 * Last updated 2024-02-11.
 */
interface TsConfig {

    extends?: string;
    files?: string[] | false;
    include?: string | string[];
    exclude?: string[];

    /** 
     * COMPILER OPTIONS
     * @link https://www.typescriptlang.org/tsconfig#compiler-options
     */
    compilerOptions?: {
        /** 
         * Type Checking
         * @link https://www.typescriptlang.org/tsconfig#Type_Checking_6248
         */
        allowUnreachableCode?: boolean | undefined;
        allowUnusedLabels?: boolean | undefined;
        alwaysStrict?: boolean;
        exactOptionalPropertyTypes?: boolean;
        noFallthroughCasesInSwitch?: boolean;
        noImplicitAny?: boolean;
        noImplicitOverride?: boolean;
        noImplicitReturns?: boolean;
        noImplicitThis?: boolean;
        noPropertyAccessFromIndexSignature?: boolean;
        noUncheckedIndexedAccess?: boolean;
        noUnusedLocals?: boolean;
        noUnusedParameters?: boolean;
        strict?: boolean;
        strictBindCallApply?: boolean;
        strictFunctionTypes?: boolean;
        strictNullChecks?: boolean;
        strictPropertyInitialization?: boolean;
        useUnknownInCatchVariables?: boolean;
        /** 
         * Modules 
         * @link https://www.typescriptlang.org/tsconfig#Modules_6244
         */
        allowArbitraryExtensions?: boolean;
        allowImportingTsExtensions?: boolean;
        allowUmdGlobalAccess?: boolean;
        baseUrl?: string;
        customConditions?: string[];
        module?: "none" | "commonjs" | "amd" | "umd" | "system" | "es6" | "es2015" | "es2020" | "es2022" | "esnext" | "node16" | "nodenext";
        moduleResolution?: "classic" | "node10" | "node" | "node16" | "nodenext" | "bundler";
        moduleSuffixes?: string[];
        noResolve?: boolean;
        paths?: {
            [ key: string ]: string[] | string[];
        };
        resolveJsonModule?: boolean;
        resolvePackageJsonExports?: boolean;
        resolvePackageJsonImports?: boolean;
        rootDir?: string;
        rootDirs?: string[];
        typeRoots?: string[];
        types?: string[];
        /** 
         * Emit 
         * @link https://www.typescriptlang.org/tsconfig#Emit_6246
         */
        declaration?: boolean;
        declarationDir?: string;
        declarationMap?: boolean;
        downlevelIteration?: boolean;
        emitBOM?: boolean;
        emitDeclarationOnly?: boolean;
        importHelpers?: boolean;
        importsNotUsedAsValues?: "remove" | "preserve" | "error";
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        mapRoot?: string;
        newLine?: "crlf" | "lf";
        noEmit?: boolean;
        noEmitHelpers?: boolean;
        noEmitOnError?: boolean;
        outDir?: string;
        outFile?: string;
        preserveConstEnums?: boolean;
        preserveValueImports?: boolean;
        removeComments?: boolean;
        sourceMap?: boolean;
        sourceRoot?: string;
        stripInternal?: boolean;
        /** 
         * JavaScript Support 
         * @link https://www.typescriptlang.org/tsconfig#JavaScript_Support_6247
         */
        allowJs?: boolean;
        checkJs?: boolean;
        maxNodeModuleJsDepth?: number;
        /** 
         * Editor Support 
         * @link https://www.typescriptlang.org/tsconfig#Editor_Support_6249
         */
        disableSizeLimit?: boolean;
        plugin?: string[];
        /** 
         * Interop Constraints 
         * @link https://www.typescriptlang.org/tsconfig#Interop_Constraints_6252
         */
        allowSyntheticDefaultImports?: boolean;
        esModuleInterop?: boolean;
        forceConsistentCasingInFileNames?: boolean;
        isolatedModules?: boolean;
        preserveSymlinks?: boolean;
        verbatimModuleSyntax?: boolean;
        /** 
         * Backwards Compatibility 
         * @link https://www.typescriptlang.org/tsconfig#Backwards_Compatibility_6253
         */
        charset?: "utf8" | "utf16";
        keyofStringsOnly?: boolean;
        noImplicitUseStrict?: boolean;
        noStrictGenericChecks?: boolean;
        suppressExcessPropertyErrors?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        /** 
         * Language and Environment 
         * @link https://www.typescriptlang.org/tsconfig#Language_and_Environment_6254
         */
        emitDecoratorMetadata?: boolean;
        experimentalDecorators?: boolean;
        jsx?: "preserve" | "react" | "react-native" | "react-jsx" | "react-jsxdev";
        jsxFactory?: string;
        jsxFragmentFactory?: string;
        jsxImportSource?: string;
        lib?: "ES5" | "ES2015" | "ES6" | "ES2016" | "ES7" | "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext" | "DOM" | "WebWorker" | "ScriptHost"
        | ( "ES5" | "ES2015" | "ES6" | "ES2016" | "ES7" | "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext" | "DOM" | "WebWorker" | "ScriptHost" )[];
        moduleDetection?: "legacy" | "auto" | "forced";
        noLib?: boolean;
        reactNamespace?: string;
        target?: "es3" | "es5" | "es6" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "esnext";
        useDefineForClassFields?: boolean;
        /** 
         * Compiler Diagnostics 
         * @link https://www.typescriptlang.org/tsconfig#Compiler_Diagnostics_6251
         */
        explainFiles?: boolean;
        extendedDiagnostics?: boolean;
        generateCpuProfile?: string;
        listEmittedFiles?: boolean;
        listFiles?: boolean;
        traceResolution?: boolean;
        /** 
         * Projects 
         * @link https://www.typescriptlang.org/tsconfig#Projects_6255
         */
        composite?: boolean;
        disableReferencedProjectLoad?: boolean;
        disableSolutionSearching?: boolean;
        disableSourceOfProjectReferenceRedirect?: boolean;
        incremental?: boolean;
        tsBuildInfoFile?: string;
        /** 
         * Output Formatting 
         * @link https://www.typescriptlang.org/tsconfig#Output_Formatting_6256
         */
        noErrorTruncation?: boolean;
        preserveWatchOutput?: boolean;
        pretty?: boolean;
        /** 
         * Completeness 
         * @link https://www.typescriptlang.org/tsconfig#Completeness_6257
         */
        skipLibCheck?: boolean;
        /** 
         * Command Line 
         * @link https://www.typescriptlang.org/tsconfig#Command_line_Options_6171
         */
        /** 
         * Watch Options 
         * @link https://www.typescriptlang.org/tsconfig#Watch_and_Build_Modes_6250
         */
        assumeChangesOnlyAffectDirectDependencies?: boolean;
    };

    /** 
     * WATCH OPTIONS
     * @link https://www.typescriptlang.org/tsconfig#watch-options
     */
    watchOptions?: {
        watchFile?: "fixedpollinginterval" | "prioritypollinginterval" | "dynamicprioritypolling" | "fixedchunksizepolling" | "usefsevents" | "usefseventsonparentdirectory";
        watchDirectory?: "usefsevents" | "fixedpollinginterval" | "dynamicprioritypolling" | "fixedchunksizepolling";
        fallbackPolling?: "fixedinterval" | "priorityinterval" | "dynamicpriority" | "fixedchunksize ";
        synchronousWatchDirectory?: boolean;
        excludeDirectories?: string[];
        excludeFiles?: string[];
    };

    /** 
     * TYPE ACQUISITION
     * @link https://www.typescriptlang.org/tsconfig#type-acquisition
     */
    typeAcquisition?: {
        enable?: boolean;
        include?: string[];
        exclude?: string[];
        disableFilenameBasedTypeAcquisition?: boolean;
    };
}



/** # EXPORT
 ** ======================================================================== **/

export type {
    PackageJson,
    TsConfig,
};