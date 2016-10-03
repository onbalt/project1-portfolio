(function() {
  'use strict';

  setTimeout(function() {
    //document.querySelector('.greating_picture').classList.add('m--show');
  }, 1000);
})();

$(document).ready(function() {

  $(document).on('click', '.menu__open-link, .menu__close-link', function(e){
    e.preventDefault();
    $(this).parents('.menu').toggleClass('menu_closed');
  });

  $.each($('path.skills__circle-svg-path'), function(i, path) {
    var percent = $(path).data('percent'),
        pathLength = path.getTotalLength(),
        pathPercentLength = (100 - percent) * pathLength / 100;
    $(path).css({'stroke-dasharray': pathLength, 'stroke-dashoffset': pathLength});
    setTimeout(function() {
      $(path).css({'opacity': '.'+percent, 'stroke-dashoffset': pathPercentLength});
    }, 600 * (i + 4));
  });

});