// polyfill
require("babel-polyfill");

const fs = require("fs");

const gulp = require("gulp");
const mkdirp = require("mkdirp");

const browserify = require("browserify");
const babelify = require("babelify");

const babelrc = {
	babelrc:    false,
    presets:    ["latest"],
	plugins:	["transform-runtime", "transform-strict-mode"]
};

gulp.task("js", async () => {
    await new Promise((resolve, reject) => mkdirp("build/js", error => error ? reject(error) : resolve()));

    return browserify("src/js/main.js")
        .transform(babelify, babelrc)
        .bundle()
        .pipe(fs.createWriteStream("build/js/main.js"));
});

gulp.task("cp", () => {
    return gulp.src(["src/**", "!src/js/**"])
        .pipe(gulp.dest("build"));
});

gulp.task("default", gulp.parallel("js", "cp"));
