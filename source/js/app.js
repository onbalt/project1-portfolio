$(function() {

	var menuToggleLinks = '.menu__open-link, .menu__close-link';
	$(document).on('click', menuToggleLinks, function (e) {
		e.preventDefault();
		$(this).parents('.menu').toggleClass('menu_closed');
	});

	var $skillsCircles = $('path.skills__circle-svg-path');
	$.each($skillsCircles, function (i, path) {
		var $path = $(path),
			percent = $path.data('percent'),
			pathLength = path.getTotalLength(),
			pathPercentLength = (100 - percent) * pathLength / 100;
		$path.css({
			'stroke-dasharray': pathLength,
			'stroke-dashoffset': pathLength
		});
		setTimeout(function () {
			$(path).css({
				'opacity': '.' + percent,
				'stroke-dashoffset': pathPercentLength
			});
		}, 600 * (i + 4));
	});

});