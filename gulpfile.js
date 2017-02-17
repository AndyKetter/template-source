var releaseDest = "../template/";//发布目录
//所有的src,runSequence前面都必须加上return,watch前面可不return,按标准来写不要省了return,不然runSequence不能实现同步，会出现异步,因为你不写retuan,runSequence插件就不知道你什么时候结束了任务而不能去
  // 执行同步操作
var entry = {};//入口文件
entry.js = './js/*.js';
// entry.img = './**/images/*';
entry.scss = './scss/*.scss';
var output = {};//输出文件
output.js = releaseDest+"site/js/";
// output.img = './static/images/';
output.css = releaseDest+"site/css/";
// var page = {};//html
// page.entry = './pagesrc/*.html';//page入口文件
// page.output = './page/';//加版本号后的路径，最终使用路径
var gulp = require('gulp'), //gulp基础库
    babel = require('gulp-babel'),// babel，用于转换es6后缀文件
    gutil = require("gulp-util"),//gulp工具库,最好默认引入
    sass = require('gulp-sass'),//sass编译
    autoprefixer = require('gulp-autoprefixer'),//css自动加前缀
    minifycss = require('gulp-minify-css'),//css压缩
    uglify = require('gulp-uglify'),//js压缩
    minifyImg = require('gulp-imagemin'),//图片压缩
    rename = require('gulp-rename'),//重命名
    clean = require('gulp-clean'),//清除
    rev = require('gulp-rev-append'),//版本号
    concat = require('gulp-concat'),//合并
    notify = require('gulp-notify'),//消息提示
    cache = require('gulp-cache'),//图片cache
    webpack = require('webpack'),//webpack
    gwebpack = require('gulp-webpack'),//gulp-webpack
    named = require('vinyl-named'),//保持原有文件名
    runSequence = require('gulp-run-sequence'),// 按队列执行任务
    importCss = require('gulp-import-css'); // css文件导入
// Sass文件处理
gulp.task('packSass', function(){
    return gulp.src([entry.scss, '!**/*.css']).
        pipe(sass().on('error', sass.logError)).
        pipe(importCss()). // 处理 @import url
        pipe(autoprefixer('last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4')).
        // pipe(minifycss()).
        pipe(gulp.dest(output.css)).
        pipe(notify({ message: 'packSass task complete' }));
});
gulp.task('gulpjs',function () {//打包js
    return gulp.src([entry.js])
    .pipe(named())
    .pipe(gwebpack({
        // watch: true,
        module: {
            loaders: [
                //加载器，test用于正则匹配,loader指定加载器名字,多个加载器通过"!"连接,url-loader支持base64编码的行内资源
                {test:/\.js[x]?$/,exclude:/node_modules/,loader:'babel-loader'},//支持es6写法完美转化为es5，同时支持js,jsx后缀的打包
                {test:/\.(css)$/,loader:'style-loader!css-loader'},
                {test:/\.(png|jpg)$/,loader:'url-loader?limit=8192'},
                {test:/\.svg/,loader:'url-loader?limit=8192&mimetype=image/svg+xml'},
                {test:/\.eot/,loader:'url-loader?limit=8192&mimetype=application/vnd.ms-fontobject'},
                {test:/\.woff2/,loader:'url-loader?limit=8192&mimetype=application/font-woff2'},
                {test:/\.woff/,loader:'url-loader?limit=8192&mimetype=application/font-woff'},
                {test:/\.ttf/,loader:'url-loader?limit=8192&mimetype=application/font-ttf'}
            ],
        },
    }))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(uglify())
    .pipe(gulp.dest(output.js))
    .pipe(notify({ message: 'js task complete' }));
});
//监听任务
gulp.task('watch',function () {
    gulp.watch(entry.scss, ['packSass','gulpjs']);
    gulp.watch(entry.js, ['gulpjs']);
});
// 默认执行任务队列
gulp.task('default', function(){//gulp release 后还可以执行def任务    用法如  gulp release moveSrc
    //runSequence与  gulp.start的区别是  runSequence是同步执行数组任务,而gulp.start是异步执行数组任务,比如packCss依赖packJs,packJs执行完才可以执行packCss,那么必须用同步,所以队列任务一般用runSequence来执行
    return runSequence('watch');
});
