/*!
 * @package @maddimathon/utility-classes@1.0.0
 * @link https://github.com/maddimathon/utility-classes-js
 * @license MIT
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
    author?: string | {
        name: string;
        email?: string;
        url?: string;
    };
    contributors?: PackageJson[ 'author' ][];
    funding?: string | {
        type: string;
        url: string;
    } | ( string | {
        type: string;
        url: string;
    } )[];
    files?: string[];
    main?: string;
    browser?: string;
    bin?: string | {
        [ key: string ]: string;
    };
    man?: string | string[];
    directories?: {
        [ key: string ]: string;
    };
    repository?: string | {
        type: string;
        url: string;
        directory?: string;
    };
    scripts?: {
        [ key: string ]: string;
    };
    config?: {
        [ key: number | string ]: any;
    };
    dependencies?: {
        [ key: string ]: string;
    };
    devDependencies?: {
        [ key: string ]: string;
    };
    peerDependencies?: {
        [ key: string ]: string;
    };
    peerDependenciesMeta?: {
        [ key: string ]: {
            [ key: string ]: string;
        };
    };
    bundleDependencies?: string[];
    optionalDependencies?: {
        [ key: string ]: string;
    };
    overrides?: {
        [ key: string ]: string | PackageJson[ 'overrides' ];
    };
    engines?: {
        [ key: string ]: string;
    };
    os?: string[];
    cpu?: string[];
    private?: boolean;
    publishConfig?: {
        [ key: string ]: boolean | number | string;
    };
    workspaces?: string[];
}
interface TsConfig {
    extends?: string;
    files?: string[] | false;
    include?: string | string[];
    exclude?: string[];
    compilerOptions?: {
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
        allowJs?: boolean;
        checkJs?: boolean;
        maxNodeModuleJsDepth?: number;
        disableSizeLimit?: boolean;
        plugin?: string[];
        allowSyntheticDefaultImports?: boolean;
        esModuleInterop?: boolean;
        forceConsistentCasingInFileNames?: boolean;
        isolatedModules?: boolean;
        preserveSymlinks?: boolean;
        verbatimModuleSyntax?: boolean;
        charset?: "utf8" | "utf16";
        keyofStringsOnly?: boolean;
        noImplicitUseStrict?: boolean;
        noStrictGenericChecks?: boolean;
        suppressExcessPropertyErrors?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        emitDecoratorMetadata?: boolean;
        experimentalDecorators?: boolean;
        jsx?: "preserve" | "react" | "react-native" | "react-jsx" | "react-jsxdev";
        jsxFactory?: string;
        jsxFragmentFactory?: string;
        jsxImportSource?: string;
        lib?: "ES5" | "ES2015" | "ES6" | "ES2016" | "ES7" | "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext" | "DOM" | "WebWorker" | "ScriptHost" | ( "ES5" | "ES2015" | "ES6" | "ES2016" | "ES7" | "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext" | "DOM" | "WebWorker" | "ScriptHost" )[];
        moduleDetection?: "legacy" | "auto" | "forced";
        noLib?: boolean;
        reactNamespace?: string;
        target?: "es3" | "es5" | "es6" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "esnext";
        useDefineForClassFields?: boolean;
        explainFiles?: boolean;
        extendedDiagnostics?: boolean;
        generateCpuProfile?: string;
        listEmittedFiles?: boolean;
        listFiles?: boolean;
        traceResolution?: boolean;
        composite?: boolean;
        disableReferencedProjectLoad?: boolean;
        disableSolutionSearching?: boolean;
        disableSourceOfProjectReferenceRedirect?: boolean;
        incremental?: boolean;
        tsBuildInfoFile?: string;
        noErrorTruncation?: boolean;
        preserveWatchOutput?: boolean;
        pretty?: boolean;
        skipLibCheck?: boolean;
        assumeChangesOnlyAffectDirectDependencies?: boolean;
    };
    watchOptions?: {
        watchFile?: "fixedpollinginterval" | "prioritypollinginterval" | "dynamicprioritypolling" | "fixedchunksizepolling" | "usefsevents" | "usefseventsonparentdirectory";
        watchDirectory?: "usefsevents" | "fixedpollinginterval" | "dynamicprioritypolling" | "fixedchunksizepolling";
        fallbackPolling?: "fixedinterval" | "priorityinterval" | "dynamicpriority" | "fixedchunksize ";
        synchronousWatchDirectory?: boolean;
        excludeDirectories?: string[];
        excludeFiles?: string[];
    };
    typeAcquisition?: {
        enable?: boolean;
        include?: string[];
        exclude?: string[];
        disableFilenameBasedTypeAcquisition?: boolean;
    };
}
export type { PackageJson, TsConfig, };
