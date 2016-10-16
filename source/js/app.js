
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

$(function() {
	var $sliders = $('.slider');
	$.each($sliders, function (i, slider) {
		var $slider = $(slider),
			$list = $slider.find('.slider__list'),
			$items = $list.find('.slider__item'),
			itemsCount = $items.length,
			itemsLastIndex = itemsCount - 1,
			$current = $slider.find('.slider-current'),
			$currentHeading = $current.find('.slider-current__heading'),
			$currentText = $current.find('.slider-current__heading'),
			$currentLink = $current.find('.slider-current__link'),
			cssSetTimeout = 800;
		$items.eq(0).addClass('slider__item_active')
			.next().addClass('slider__item_next');
		$items.eq(itemsLastIndex).addClass('slider__item_prev');

		$list.on('click', '.slider__item_prev, .slider__item_next', function (e) {
			e.preventDefault();
			var $this = $(this),
				direction = $this.hasClass('slider__item_prev') ? -1 : 1,
				$active = $items.filter('.slider__item_active'),
				$prev = (direction == -1) ? $this : $items.filter('.slider__item_prev'),
				$next = (direction == 1)  ? $this : $items.filter('.slider__item_next'),
				$target = $targetPrev = $targetNext = null;

			if (direction > 0) {
				$target = $active.nextOrFirst();
				$targetPrev = $prev.nextOrFirst();
				$targetNext = $next.nextOrFirst();
			} else {
				$target = $active.prevOrLast();
				$targetPrev = $prev.prevOrLast();
				$targetNext = $next.prevOrLast();
			}

			$current.addClass('slider-current_hidden');
			$prev.addClass('slider__item_state_bottom').removeClass('slider__item_prev slider__item_state_top');
			$targetPrev.addClass('slider__item_state_left slider__item_state_top');
			$active.removeClass('slider__item_active');
			$target.addClass('slider__item_active').removeClass('slider__item_state_left slider__item_state_right slider__item_state_bottom slider__item_state_top');
			$next.addClass('slider__item_state_top').removeClass('slider__item_next slider__item_state_bottom');
			$targetNext.addClass('slider__item_state_right slider__item_state_bottom');

			setTimeout(function () {
				$currentHeading.text($target.children('a').attr('title'));
				$currentLink.attr('href', $target.children('a').attr('href'));
				$currentText.text($target.data('text'));
				$current.removeClass('slider-current_hidden');
				$prev.removeClass('slider__item_state_left slider__item_state_bottom');
				$next.removeClass('slider__item_state_right slider__item_state_top');
				$targetPrev.addClass('slider__item_prev');
				$targetNext.addClass('slider__item_next');
			}, cssSetTimeout);

		});

	});
});

$(function() {
	$.fn.nextOrFirst = function(selector) {
		var next = this.next(selector);
		return (next.length) ? next : this.siblings(selector).first();
	};
	$.fn.prevOrLast = function(selector) {
		var prev = this.prev(selector);
		return (prev.length) ? prev : this.siblings(selector).last();
	};
});
