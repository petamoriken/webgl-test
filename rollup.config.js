const $ = require("rollup-load-plugins")();

export default {
    entry: "src/js/main.js",
    dest: "build/js/main.js",
    format: "iife",
    sourceMap: true,
    plugins: [
        $.nodeResolve(),
        $.commonjs(),
        $.sourcemaps()
    ]
}