/**
 * Required Packages
 */

var postcss = require('gulp-postcss'),
    gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    tailwindcss = require('tailwindcss'),
    purgecss = require('@fullhuman/postcss-purgecss');

/**
 * Resources paths
 */
var paths = {

    css: {
        source: 'src/_includes/assets/main.css',
        dest: 'src/static'
    },

}

/**
 * Errors function
 */
var onError = function (err) {
    notify.onError({
        title: "Gulp Error - Compile Failed",
        message: "Error: <%= error.message %>"
    })(err);

    this.emit('end');
};

class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}

/**
 * Create the tailwind.config.js file.
 */
//gulp.task('tailwind:init', run('./node_modules/.bin/tailwind init tailwind.config.js'));


/**
 * Compile Tailwind
 */
function cssCompile() {
    return gulp.src(paths.css.source)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(postcss([
            tailwindcss('tailwind.config.js')
        ]))
        .pipe(gulp.dest("src/static"))
        .pipe(notify({
            message: 'Tailwind - Compile Success'
        }));
}

function cssMinify() {
    return gulp.src([
            'src/static/main.css',
            '!src/static/*.min.css'
        ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("src/static"))
        .pipe(notify({
            message: 'CSS - Minify Success'
        }));
}

exports.css = gulp.series(cssCompile, cssMinify);


function dev() {
    gulp.watch('tailwind.config.js', cssCompile);
    gulp.watch(paths.css.source, cssCompile);
}

exports.dev = gulp.series(cssCompile, dev);

function cssCompilePreflight() {
    return gulp.src(paths.css.source)
        .pipe(postcss([
            tailwindcss('./tailwind.config.js'),
            purgecss({
                content: [
                    'src/_includes/**/*.html',
                ],
                extractors: [{
                    extractor: TailwindExtractor,
                    extensions: ['html', 'njk'],
                }],
                /**
                 * You can whitelist selectors to stop purgecss from removing them from your CSS.
                 * see: https://www.purgecss.com/whitelisting
                 *
                 * Any selectors defined below will not be stripped from the min.css file.
                 * PurgeCSS will not purge the standard app.css file as this is useful for development.
                 *
                 * @since 1.0.0
                 */
                whitelist: [
                    'body',
                    'html',
                    'h1',
                    'h2',
                    'h3',
                    'p',
                    // 'blockquote',
                    //'intro'
                ],
            })
        ]))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(notify({
            message: 'Tailwind Preflight Success'
        }));
}

exports.build = gulp.series(cssCompilePreflight, cssMinify);

function mobileDev() {

    gulp.watch('tailwind.config.js', gulp.series(cssCompilePreflight, cssMinify));
    gulp.watch(paths.css.source, gulp.series(cssCompilePreflight, cssMinify));
    gulp.watch("src/**/*.html", gulp.series(cssCompilePreflight, cssMinify))
}

exports.mobileDev = gulp.series(cssCompilePreflight, mobileDev);