'use strict';

module.exports = function() {
  $.gulp.task('sprite:svg', function() {
    return $.gulp.src('./source/sprite/*.svg')
      .pipe($.gp.svgmin({
        js2svg: {
          pretty: true
        }
      }))
      .pipe($.gp.cheerio({
        run: function ($) {
          $('[fill][fill!="none"]').attr('fill', 'currentColor');
          $('[stroke][stroke!="none"]').attr('stroke', 'currentColor');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
      }))
      .pipe($.gp.replace('&gt;', '>'))
      .pipe($.gp.svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      }))
      .pipe($.gulp.dest($.config.root + '/assets/img'))
  })
};
