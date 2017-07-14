/*
* @Author: anchen
* @Date:   2016-11-30 11:19:43
* @Last Modified by:   anchen
* @Last Modified time: 2017-07-14 21:45:33
*/

'use strict';
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano'); //css压缩
var spriter = require('gulp-css-spriter'); //合并图片生成雪碧图
var browserSync = require('browser-sync');
var concat = require('gulp-concat'); //合并
var uglify = require('gulp-uglify'); //压缩javascript文件，减小文件大小
var htmlmin = require('gulp-htmlmin'); //压缩html
var babel = require('gulp-babel');//支持es6

// 1. LESS编译 压缩 --合并没有必要，一般预处理CSS都可以导包
gulp.task('style',function () {
	gulp.src(['src/less/*.less', '!src/less/_*.less'])
		.pipe(less())
		.pipe(gulp.dest('src/css'))
		.pipe( spriter({
		    //要生成的雪碧图的路径和名字
		    'spriteSheet': './dist/images/spritesheet.png',
		    //css中引用的图片的路径
		    'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
		}) )
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({
		  stream: true
		}));
})

//2.处理JS
gulp.task('js',function () {
	gulp.src(['src/js/*.js'])
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({
		  stream: true
		}));
})

// 3. 图片复制
gulp.task('image', function() {
  gulp.src('src/images/*.*')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 4. HTML
gulp.task('html', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//browserSync服务
gulp.task('serve', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: ['dist']
    },
    ui:{
    	port:8080
    }
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });

  gulp.watch('src/less/*.less',['style']);
  gulp.watch('src/js/*.js',['js']);
  gulp.watch('src/images/*.*',['image']);
  gulp.watch('src/*.html',['html']);
});

gulp.task('default', ['serve','image'], function() {
    console.log('browserSync服务开启');
});
