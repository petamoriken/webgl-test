"use strict";

const gulp = require("gulp");
const exec = require("child_process").exec;

gulp.task("js", () => {
    return new Promise((resolve, reject) => exec("rollup -c", err => err ? reject(err) : resolve()));
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
