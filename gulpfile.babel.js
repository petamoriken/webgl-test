"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

const $$ = require("rollup-load-plugins")();

gulp.task("js", () => {
    return gulp.src("src/js/**.js")
        .pipe($.plumber())
        .pipe($.rollup({
            allowRealFiles: true,
            entry: "src/js/main.js",
            format: "iife",
            plugins: [
                $$.nodeResolve(),
                $$.commonjs()
            ]
        })).pipe(gulp.dest("build/js"));
});

gulp.task("cp", () => {
    return gulp.src(["src/**", "!src/js/**"], { since: gulp.lastRun("cp") })
        .pipe(gulp.dest("build"));
});

gulp.task("watch", () => {
    gulp.watch("src/js/**.js", gulp.series("js"));
    gulp.watch(["src/**", "!src/js/**"], gulp.series("cp"));
});

gulp.task("default", gulp.parallel("js", "cp"));
