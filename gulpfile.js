
// Load plugins 加载插件
var path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
   // jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var src = __dirname + '/src/';
var dist = __dirname + '/dist/';

// html 的移动
gulp.task('html', function() {
  return gulp.src( src + '*.html' )
    .pipe(gulp.dest( dist))
    .pipe(notify({ message: 'html task complete' }));
});

// Styles 编译sass、自动添加css前缀和压缩
gulp.task('styles', function() {
    return gulp.src( src +'css/**/*.scss' )
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest( dist + 'css' ))
    .pipe(browserSync.reload({stream: true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest( dist + 'css' ))
    .pipe(notify({ message: 'Styles task complete' }));
});

// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
    return gulp.src( src +'css/**/*.css' )
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: false
    }))
    .pipe(gulp.dest( dist + 'css' ))
    .pipe(browserSync.reload({stream: true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest( dist + 'css' ))
    .pipe(notify({ message: 'css task complete' }));
});

// Scripts js代码校验、合并和压缩
gulp.task('scripts', function() {
  return gulp.src( src + 'js/**' )
    //.pipe(jshint())
    //.pipe(jshint.reporter('default'))
    .pipe(gulp.dest( dist + 'js' ))
    .pipe(browserSync.reload({stream: true}))
    //.pipe(concat('all.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest( dist + 'js/**' ))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// plugin 插件的移动
gulp.task('plugin', function() {
  return gulp.src( src + 'plugin/**' )
    .pipe(gulp.dest( dist + 'plugin/**' ))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({ message: 'pligin task complete' }));
});

// Images 图片压缩
gulp.task('images', function() {
  return gulp.src( src + 'images/**/*.*' )
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest( dist + 'images/' ))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb){
    del([dist], cb);
});

gulp.task('build', ['clean'], function(){
   gulp.start('html','styles','css','plugin', 'scripts', 'images');
});

gulp.task('serve', ['html','styles','css','plugin', 'scripts', 'images'], function() {
    browserSync.init({
        server: "./dist"
    });
    
    gulp.watch( src +'css/**/*.scss', ['styles']);
    gulp.watch( src +'css/**/*.css', ['css']);
    gulp.watch( src + 'js/**', ['scripts']);
    gulp.watch( src + 'plugin/**', ['plugin']);
    gulp.watch( src + 'images/**/*.*', ['images']); 
    gulp.watch( src + '*.html').on('change', reload)
});

gulp.task('default', ['serve']);