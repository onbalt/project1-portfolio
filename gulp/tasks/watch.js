'use strict';

module.exports = function() {
  $.gulp.task('watch', function() {
    $.gulp.watch('./source/js/**/*.js', $.gulp.series('js:process'));
    $.gulp.watch('./source/style/common/**/*.scss', $.gulp.series('sass.header','sass'));
    $.gulp.watch('./source/style/header/**/*.scss', $.gulp.series('sass.header'));
    $.gulp.watch('./source/style/other/**/*.scss', $.gulp.series('sass'));
    $.gulp.watch('./source/template/**/*.pug', $.gulp.series('pug'));
    $.gulp.watch('./source/fonts/**/*.*', $.gulp.series('copy:font'));
    $.gulp.watch('./source/images/**/*.*', $.gulp.series('copy:image'));
  });
};
