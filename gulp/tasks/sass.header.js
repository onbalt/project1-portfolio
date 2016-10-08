'use strict';

module.exports = function() {
  $.gulp.task('sass.header', function() {
    return $.gulp.src('./source/style/header.scss')
      .pipe($.gp.sourcemaps.init())
      .pipe($.gp.sass()).on('error', $.gp.notify.onError({ title: 'Header Style' }))
      .pipe($.gp.autoprefixer({ browsers: $.config.autoprefixerConfig }))
      .pipe($.gp.groupCssMediaQueries())
      // .pipe($.gp.csso()) //TODO: Check package.json for unneeded gulp concat-css plugins
      .pipe($.gp.sourcemaps.write())
      .pipe($.gulp.dest($.config.root + '/assets/css'))
      .pipe($.browserSync.stream());
  })
};
