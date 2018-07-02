var gulp = require('gulp'),
	connect=require('gulp-connect'),
	html2js=require('gulp-ng-html2js'),
	concat=require('gulp-concat'),
	clean=require('gulp-clean'),
	less=require('gulp-less'),
	csso=require('gulp-csso'),
	uglify=require('gulp-uglify'),
	sourceMaps=require('gulp-sourcemaps'),
	deleteLines = require('gulp-delete-lines');

var webServerRoot='dist/',
	appName='EI',
	appJsPath=webServerRoot+'js/',
	appImgPath=webServerRoot+'images/',
	appTemplatesJsName=appName+'.templates.js',
	appJsName=appName+'.js',
	appCssPath=webServerRoot+'css/';

gulp.task('default', ['build-dev', 'webserver', 'watch','copy-image','copy-assets','copy-partials','copy-json']);
gulp.task('clear', ['clear-all']);
gulp.task('release', ['clean-temporaryFile','build-release', 'clean-maps','copy-image','copy-assets','copy-partials','copy-json', 'webserver-release']);
gulp.task('native', ['clean-temporaryFile','build-native', 'copy-image','copy-assets', 'copy-partials','copy-json','watch-native']);
gulp.task('weixin', ['clean-temporaryFile','build-weixin', 'copy-image','copy-assets', 'copy-partials','copy-json','watch-weixin']);

gulp.task('build-dev',['build-vendor-dev', 'html2js-dev', 'build-js-dev', 'build-less-dev', 'build-index-dev']);
gulp.task('build-release',['build-vendor-release', 'html2js-release','build-js-release', 'build-less-release', 'build-index']);
gulp.task('build-native',['build-vendor-release', 'html2js-release','build-js-native', 'build-less-release', 'build-index-native']);
gulp.task('build-weixin',['build-vendor-release', 'html2js-release','build-js-weixin', 'build-less-release', 'build-index-weixin']);
gulp.task('generate', ['build-dev','copy-image','copy-assets','copy-partials']);

gulp.task('clear', ['clear-all']);
//web server
gulp.task('webserver', ['build-dev'], function() {
	connect.server({
		root:webServerRoot,
		port:8080,
		fallback:webServerRoot+'index.html',
		debug:true
	});
});
gulp.task('webserver-release', function() {
	connect.server({
		root:webServerRoot,
		port:12009,
		fallback:webServerRoot+'index.html',
		debug:true
	});
});

//清除临时文件
gulp.task('clean-temporaryFile',['copy-image','copy-assets', 'webserver-release'],function(){
	return gulp.src("temporary/**/*.*")
		.pipe(clean());
});

//html2js
gulp.task('html2js-dev', ['clean-html2js'], function(){
	return gulp.src("src/**/*.tpl.html")
		.pipe(sourceMaps.init())
		.pipe(html2js({
			moduleName: 'EI.templates',
			stripPrefix: 'app/'
		}))
		.pipe(concat(appTemplatesJsName))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath));
});

gulp.task('html2js-release', ['clean-html2js'], function(){
	return gulp.src("src/**/*.tpl.html")
		.pipe(html2js({
			moduleName: 'EI.templates',
			stripPrefix: 'app/'
		}))
		.pipe(concat(appTemplatesJsName))
		.pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('clean-html2js',function(){
	return gulp.src(webServerRoot+appJsPath+appTemplatesJsName)
		.pipe(clean());
});

//删除 mock依赖
gulp.task('build-js-temporarymock', ['clean-js'], function(){
	return gulp.src(["src/app/app.js"])
	   	.pipe(deleteLines({
	      'filters': [
	      'EI.common.mocksJS'
	      ]
	    }))
	   	.pipe(concat('temporary.'+appJsName))
		.pipe(gulp.dest('temporary/'));
});

//js
gulp.task('build-js-release', ['clean-js','build-js-temporarymock'], function(){
	return gulp.src(['temporary/'+'temporary.'+appJsName,"src/**/*.js",'!src/**/*.mock.js','!src/app/app.js'])
		.pipe(concat(appJsName))
		.pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('build-js-native', ['clean-js','build-js-temporarymock'], function(){
	return gulp.src(['temporary/'+'temporary.'+appJsName,"src/**/*.js",'!src/**/*.mock.js','!src/app/app.js','!src/**/*.wx.js'])
		.pipe(concat(appJsName))
		.pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('build-js-weixin', ['clean-js','build-js-temporarymock','clean-maps'], function(){
	return gulp.src(['temporary/'+'temporary.'+appJsName,"src/**/*.js",'!src/**/*.mock.js','!src/app/app.js','!src/**/*.native.js'])
		.pipe(concat(appJsName))
		.pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('build-js-dev', ['clean-js'], function(){
	return gulp.src(["src/**/*.js",'!src/**/*.native.js','!src/**/*.wx.js'])
		.pipe(sourceMaps.init())
		.pipe(concat(appJsName))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath));
});

gulp.task('clean-js',function(){
	return gulp.src(appJsPath+appJsName)
		.pipe(clean());
});

//index
gulp.task('build-index', ['clean-index'], function(){
	return gulp.src("src/index.html")
		.pipe(gulp.dest(webServerRoot));
});
gulp.task('build-index-dev', ['clean-index'], function(){
	return gulp.src("src/index.html")
		.pipe(gulp.dest(webServerRoot));
});
gulp.task('build-index-native', ['clean-index'], function(){
	return gulp.src("src/index.html")
		.pipe(deleteLines({
	      'filters': [
	      'res.wx.qq.com'
	      ]
	    }))
	    .pipe(deleteLines({
	      'filters': [
	      'window.onload'
	      ]
	    }))
		.pipe(gulp.dest(webServerRoot));
});
gulp.task('build-index-weixin', ['clean-index'], function(){
	return gulp.src("src/index.html")
		.pipe(deleteLines({
	      'filters': [
	      'cordova.js'
	      ]
	    }))
	    .pipe(deleteLines({
	      'filters': [
	      'document.addEventListener'
	      ]
	    }))
		.pipe(gulp.dest(webServerRoot));
});

gulp.task('clean-index',function(){
	return gulp.src([webServerRoot+'index.html'])
		.pipe(clean());
});
//vendor
gulp.task('build-vendor-dev', ['clean-vendor'], function(){
	gulp.src([
		'vendor/reset/reset.css',
        'vendor/angular-jqcloud/jqcloud.css'
    ])
		.pipe(sourceMaps.init())
		.pipe(concat('vendor.css'))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appCssPath));
	gulp.src([
            'vendor/base/jquery.min.js',
			'vendor/angular.js',
			'vendor/angular-resource.js',
			'vendor/angular-ui-router.min.js',
       	    'vendor/angular-jqcloud/jqcloud.js',
            'vendor/angular-jqcloud/angular-jqcloud.js'
			])
		.pipe(sourceMaps.init())
		.pipe(concat('angular.js'))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath));
});

gulp.task('build-vendor-release', ['clean-vendor'], function(){
	gulp.src(['vendor/reset/reset.css'])
		.pipe(concat('vendor.css'))
		.pipe(csso())
		.pipe(gulp.dest(appCssPath));
});

gulp.task('clean-vendor',function(){
	return gulp.src([
		webServerRoot+appCssPath+'*.css',
		webServerRoot+appJsPath+'angular.js'])
		.pipe(clean());
});

//less
gulp.task('build-less-dev', ['clean-css'], function(){
	return gulp.src('src/**/*.less')
		.pipe(sourceMaps.init())
		.pipe(less())
		.pipe(concat('EI.css'))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appCssPath));
});

gulp.task('build-less-release', ['clean-css'], function(){
	return gulp.src('src/**/*.less')
		.pipe(less())
		.pipe(concat('EI.css'))
		.pipe(csso())
		.pipe(gulp.dest(appCssPath));
});

gulp.task('clean-css',function(){
	return gulp.src(webServerRoot+appCssPath+'EI.css')
		.pipe(clean());
});

gulp.task('clean-maps',function(){
	return gulp.src(webServerRoot+'maps')
		.pipe(clean());
});
// ---------------------------------------------------------------------------------
// copy image
// ---------------------------------------------------------------------------------
gulp.task('copy-image', ['clean-image'],function() {
    gulp.src('src/images/**/*.*')
        .pipe(gulp.dest('dist/images'));

});
// ---------------------------------------------------------------------------------
// clean image
// ---------------------------------------------------------------------------------
gulp.task('clean-image',function(){
	return gulp.src('dist/images')
		.pipe(clean());
});

// copy json
// ---------------------------------------------------------------------------------
gulp.task('copy-json', ['clean-json'],function() {
    gulp.src('src/json/**/*.*')
        .pipe(gulp.dest('dist/json'));

});
// ---------------------------------------------------------------------------------
// clean json
// ---------------------------------------------------------------------------------
gulp.task('clean-json',function(){
    return gulp.src('dist/json')
        .pipe(clean());
});

// copy partials
// ---------------------------------------------------------------------------------
gulp.task('copy-partials', ['clean-partials'],function() {
    gulp.src('src/partials/**/*.*')
        .pipe(gulp.dest('dist/partials'));

});
// ---------------------------------------------------------------------------------
// clean partials
// ---------------------------------------------------------------------------------
gulp.task('clean-partials',function(){
    return gulp.src('dist/partials')
        .pipe(clean());
});
// ---------------------------------------------------------------------------------
// copy assets
// ---------------------------------------------------------------------------------
gulp.task('copy-assets', ['clean-assets'],function() {

   return gulp.src(['vendor/**/fonts/*.*'])
        .pipe(gulp.dest('dist/assets'));

});
// ---------------------------------------------------------------------------------
// clean assets
// ---------------------------------------------------------------------------------
gulp.task('clean-assets',function(){
	return gulp.src('dist/assets')
		.pipe(clean());
});

// ---------------------------------------------------------------------------------
// clear all
// ---------------------------------------------------------------------------------
gulp.task('clear-all',function(){
	return gulp.src('dist/')
		.pipe(clean());
});
// ---------------------------------------------------------------------------------


gulp.task('watch', function() {
    gulp.watch('src/index.html', ['build-index-dev']);
    gulp.watch('src/**/*.tpl.html', ['html2js-dev']);
    gulp.watch('src/**/*.less', ['build-less-dev']);
    gulp.watch(['src/**/*.js'], ['build-js-dev']);
    gulp.watch('src/images/**/*.*', ['copy-image']);
    gulp.watch('src/partials/**/*.*', ['copy-partials']);
    gulp.watch('vendor/**/*.*', ['build-vendor-dev']);
});

gulp.task('watch-native', function() {
    gulp.watch('src/index.html', ['build-index-native']);
    gulp.watch('src/**/*.tpl.html', ['html2js-release']);
    gulp.watch('src/**/*.less', ['build-less-release']);
    gulp.watch(['src/**/*.js'], ['build-js-native']);
    gulp.watch('src/images/**/*.*', ['copy-image']);
    gulp.watch('src/partials/**/*.*', ['copy-partials']);
    gulp.watch('vendor/**/*.*', ['build-vendor-release']);
});

gulp.task('watch-weixin', function() {
    gulp.watch('src/index.html', ['build-index-weixin']);
    gulp.watch('src/**/*.tpl.html', ['html2js-release']);
    gulp.watch('src/**/*.less', ['build-less-release']);
    gulp.watch(['src/**/*.js'], ['build-js-weixin']);
    gulp.watch('src/images/**/*.*', ['copy-image']);
    gulp.watch('src/partials/**/*.*', ['copy-partials']);
    gulp.watch('vendor/**/*.*', ['build-vendor-release']);
});
