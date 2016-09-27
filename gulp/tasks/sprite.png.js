'use strict';

module.exports = function() {
  $.gulp.task('sprite:png', function() {
    var spriteData = $.gulp.src('./source/sprite/*.{png,gif}')
      .pipe($.gp.spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.sass',
        imgPath: '/assets/img/sprite.png'
    }));
    spriteData.css
      .pipe($.gulp.dest('./source/style/common'));
    spriteData.img
      .pipe($.gulp.dest($.config.root + '/assets/img'));
    return spriteData;
  })
};
