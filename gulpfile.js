var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');



//定义目录路径
var app = {
	srcPath: 'src/',	//源码
	devPath: 'build/',	//测试
	prdPath: 'dist/'	//生产部署
};



//拷贝文件
gulp.task('lib', function(){
	gulp.src('bower_components/**/*')  //读取目录下的所有文件
		.pipe(gulp.dest(app.devPath + 'vendor'))
		.pipe(gulp.dest(app.prdPath + 'vendor'))
		.pipe($.connect.reload());
});

gulp.task('html', function(){
	gulp.src(app.srcPath + '**/*.html')
		.pipe(gulp.dest(app.devPath))
		.pipe(gulp.dest(app.prdPath))
		.pipe($.connect.reload());
});

gulp.task('json', function(){
	gulp.src(app.srcPath + 'data/**/*.json')
		.pipe(gulp.dest(app.devPath + 'data'))
		.pipe(gulp.dest(app.prdPath + 'data'))
		.pipe($.connect.reload());
});

gulp.task('less', function(){
	gulp.src(app.srcPath + 'style/index.less')
		.pipe($.less())
		.pipe(gulp.dest(app.devPath + 'css'))
		.pipe($.cssmin())
		.pipe(gulp.dest(app.prdPath + 'css'))
		.pipe($.connect.reload());
});

gulp.task('js', function(){
	gulp.src(app.srcPath + 'script/**/*.js')
		.pipe($.concat('index.js'))
		.pipe(gulp.dest(app.devPath + 'js'))
		.pipe($.uglify())
		.pipe(gulp.dest(app.prdPath + 'js'))
		.pipe($.connect.reload());
});

gulp.task('image', function(){
	// 使用{}指定多个扩展名
	//gulp.src('image/*.{png,jpg}')

	gulp.src(app.srcPath + 'image/**/*')
		.pipe(gulp.dest(app.devPath + 'image'))
		.pipe($.imagemin())
		.pipe(gulp.dest(app.prdPath + 'image'))
		.pipe($.connect.reload());
});

/*

	gulp.task('data', function(){
		// 要排除某个文件，在前面加上 <!>
		gulp.src(['xml/*.xml', 'json/*.json', '!json/secret-*.json']);
	});

*/


//清除目录
gulp.task('clean', function(){
	gulp.src([app.devPath, app.prdPath])
		.pipe($.clean());
});


//总任务 合并执行
gulp.task('build', ['image', 'js', 'less', 'lib', 'html', 'json']);


//编写服务器
gulp.task('serve', ['build'], function(){
	$.connect.server({
		root: [app.devPath],
		livereload: true,  //自动刷新浏览器
		port: 1234
	});

	//自动打开浏览器
	open('http://localhost:1234');

	//监控文件, 自动执行构建
	gulp.watch('bower_components/**/*', ['lib']);
	gulp.watch(app.srcPath + '**/*.html', ['html']);
	gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
	gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
	gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
	gulp.watch(app.srcPath + 'image/**/*.js', ['image']);
});

//gulp默认
gulp.task('default', ['serve']);
