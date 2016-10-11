
//preloader
$(function () {

	var imgs = [],
		percentsTotal = 1,
		// $preloaderSpinner = $('path.preloader-svg__spinner'),
		// pathSpinnerLength = $preloaderSpinner.get(0).getTotalLength(),
		$preloaderCircle = $('path.preloader-svg__percent'),
		pathCircleLength = $preloaderCircle.get(0).getTotalLength();
	// $preloaderSpinner.css({
	// 	'stroke-dasharray': '0 ' + (pathSpinnerLength / 8),
	// 	'stroke-dashoffset': -pathSpinnerLength
	// });
	$preloaderCircle.css({
		'stroke-dasharray': pathCircleLength,
		'stroke-dashoffset': pathCircleLength
	});

	$.each($('img,.check-bg'), function () {
		var path,
			$this = $(this),
			background = $this.css('background-image');

		if ($this.is('img')) {
			path = $this.attr('src');
			if (path) {
				imgs.push(path);
			}
		} else if (background != 'none' && /url\(/.test(background)) {
			path = background.replace('url("', '').replace('")', '');
			imgs.push(path);
		}

	});

	for (var i = 0; i < imgs.length; i++) {
		var image = $('<img>', {
			attr: {
				src: imgs[i]
			}
		});

		image.on({
			load : function () {
				setPercents(imgs.length, percentsTotal);
			},
			error : function () {
				setPercents(imgs.length, percentsTotal);
			}
		});
	}

	function setPercents(total, current) {
		var percent = Math.ceil(current / total * 100),
			pathPercentLength = (100 - percent) * pathCircleLength / 100;

		$preloaderCircle.css({
			'opacity': (percent >= 100) ? 1 : '.' + percent,
			'stroke-dashoffset': pathPercentLength
		});

		$('.preloader__percents').text(percent);

		if (percent >= 100) {
			$('.preloader').fadeOut();
		}
		percentsTotal++;
	}
});

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