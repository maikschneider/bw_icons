import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";

let devMode = true;

const ignoreWarnings = new Set([
    "'TYPO3' is not defined"
])

const buildConfig = {
    entryPoints: [
        "Resources/Private/JavaScript/IconElement.svelte",
        "Resources/Private/JavaScript/IconWizard.svelte",
        "Resources/Private/JavaScript/IconPicker.js",
    ],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    bundle: true,
    outdir: "Resources/Public/JavaScript/",
    format: "esm",
    plugins: [
        sveltePlugin({
            compilerOptions: {
                dev: devMode,
                customElement: true
            },
            filterWarnings(warning) {
                if (ignoreWarnings.has(warning.code)) {
                    return false
                }
            }
        })],
    logLevel: "info",
    sourcemap: true,
    external: ["@typo3/*", "@ckeditor", "lit"],
};

if (process.argv.includes('--build')) {
    await build()
} else {
    await watch()
}

async function build() {
    devMode = false;
    buildConfig.sourcemap = false
    buildConfig.minify = true
    await esbuild.build(buildConfig)
}

async function watch() {
    let ctx = await esbuild.context(buildConfig)
    await ctx.watch()
}
