//Preloader
//TODO: implement in pure JS in header.pug
var Preloader = function () {
	var imgs = [],
		totalImages = 0,
		totalPercents = 1,
		$checkImages = $('img:visible,.check-bg:visible'),
		$preloader = $('.preloader'),
		$preloaderCircle = $('path.preloader-svg__percent'),
		$preloaderPercents = $('.preloader__percents'),
		pathCircleLength = $preloaderCircle.length ? $preloaderCircle.get(0).getTotalLength() : 0;
	var init = function () {
		if (pathCircleLength == 0) return;
		$preloaderCircle.css({
			'stroke-dasharray': pathCircleLength,
			'stroke-dashoffset': pathCircleLength
		});
		collectImages();
		loadImages();
	};
	var collectImages = function () {
		$.each($checkImages, function () {
			var path,
				$this = $(this),
				background = $this.css('background-image');
			if ($this.is('img')) {
				path = $this.attr('src');
				if (path) {
					imgs.push(path);
				}
			} else if (background != 'none' && /url\(/.test(background)) {
				var matches = /url\(\"?([^\)\"]+)\"?\)/.exec(background);
				path = matches[1];
				imgs.push(path);
			}
		});
		totalImages = imgs.length;
	};
	var loadImages = function () {
		for (var i = 0; i < totalImages; i++) {
			var image = $('<img>', {
				attr: {
					src: imgs[i]
				}
			});
			image.on({
				load : function () {
					setPercents();
				},
				error : function () {
					setPercents();
				}
			});
		}
	};
	var setPercents = function() {
		var percent = Math.ceil(totalPercents / totalImages * 100),
			pathPercentLength = (100 - percent) * pathCircleLength / 100;
		$preloaderCircle.css({
			'opacity': (percent >= 100) ? 1 : '.' + percent,
			'stroke-dashoffset': pathPercentLength
		});
		$preloaderPercents.text(percent);
		if (percent >= 100) {
			$preloader.fadeOut();
		}
		totalPercents++;
	};
	return {
		init: init,
		setPercents: setPercents
	};
};
$(function() {
	var preloader = Preloader();
	preloader.init();
});

var Skills = function (path) {
	var $path = $(path),
		pathLength = path.getTotalLength();
	var init = function () {
		$path.css({
			'stroke-dasharray': pathLength,
			'stroke-dashoffset': pathLength
		});
	};
	var setPercent = function (percent) {
		var percent = percent || 100,
			pathPercentLength = (100 - percent) * pathLength / 100;
		$path.css({
			'opacity': '.' + percent,
			'stroke-dashoffset': pathPercentLength
		});
	};
	return {
		init: init,
		setPercent: setPercent
	};
};

var startSkills = function ($selector, timeout) {
	var $skillsCircles = $selector || $('path.skills__circle-svg-path'),
		skillSetTimeout = timeout || 600;
	$.each($skillsCircles, function (i, path) {
		var $path = $(path),
			percent = $path.data('percent'),
			skill = Skills(path);
		skill.init();
		setTimeout(function () {
			skill.setPercent(percent)
		}, skillSetTimeout * (i + 4));
	});
};

var Slider = function (slider) {

	var $slider = $(slider),
		$list = $slider.find('.slider__list'),
		$items = $list.find('.slider__item'),
		itemsCount = $items.length,
		itemsLastIndex = itemsCount - 1,
		$current = $slider.find('.slider-current'),
		$currentHeading = $current.find('.slider-current__heading'),
		$currentText = $current.find('.slider-current__text'),
		$currentLink = $current.find('.slider-current__link'),
		cssSetTimeout = 800;

	var init = function () {
		$items.eq(0).addClass('slider__item_active')
			.next().addClass('slider__item_next');
		$items.eq(itemsLastIndex).addClass('slider__item_prev');
		listenEvents();
	};

	var listenEvents = function () {
		$list.on('click', '.slider__item_prev, .slider__item_next', function (e) {
			e.preventDefault();
			var $this = $(this),
				direction = $this.hasClass('slider__item_prev') ? -1 : 1;
			changeSlide(direction, $this);
		});
	};

	var changeSlide = function (direction, $button) {
		var direction = direction || 1,
			$button = $button || null,
			$active = $items.filter('.slider__item_active'),
			$prev = (direction < 0 && $button) ? $button : $items.filter('.slider__item_prev'),
			$next = (direction > 0 && $button)  ? $button : $items.filter('.slider__item_next'),
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
	};

	return {
		init: init,
		slider: slider,
		change: changeSlide
	};

};

var BlogScroll = function (column, menu) {
	var minWidth = 768,
		$column = $('.' + column),
		columnTop = $column.offset().top,
		columnHeight = $column.height(),
		footerTop = $('.footer').offset().top,
		columnBottom = footerTop - columnHeight - 20,
		columnFixed = false,
		needFix = true,
		$articles = $('.article'),
		articleTops = [];

	var init = function () {
		var scrollTop = $(window).scrollTop(),
			windowWidth = $(window).width();
		if (windowWidth < minWidth) {
			needFix = false;
			initSwipeHandler();
		}
		if (needFix && scrollTop >= columnTop && scrollTop <= columnBottom) {
			setFixed();
		}
		$.each($articles, function (i, item) {
			articleTops.push($(item).offset().top - 250);
		});
	};
	var getFixed = function () {
		return columnFixed;
	};
	var setFixed = function () {
		$column.addClass(column + '_fixed');
		columnFixed = true;
	};
	var delFixed = function () {
		$column.removeClass(column + '_fixed');
		columnFixed = false;
	};
	var onScroll = function (scrollTop) {
		if (needFix) {
			if (scrollTop < columnTop || scrollTop > columnBottom) {
				if (columnFixed) {
					delFixed();
				}
			} else if ((scrollTop >= columnTop)) {
				if (!columnFixed) {
					setFixed();
				}
			}
		}
		if (!needFix || (scrollTop >= columnTop)) {
			for (var i = articleTops.length - 1; i >= 0; i--) {
				if (scrollTop >= articleTops[i]) {
					$('.' + menu + '__link_active').removeClass(menu + '__link_active');
					$('.' + menu + '__item').eq(i).children().addClass(menu + '__link_active');
					break;
				}
			}
		}
	};
	var initSwipeHandler = function () {
		$column.off().on('click', function (e) {
			$(this).toggleClass(column + '_active');
		});
		var swipeMinX = 100,
			$swipeZone = $('.main'),
			swipeDelta = 0,
			touchStartX = 0,
			touchEndX = 0;
		$swipeZone.off().on('touchstart', function (e) {
			var touch = e.originalEvent.touches[0];
			touchStartX = touchEndX = touch.pageX;
		});
		$swipeZone.on('touchmove', function (e) {
			var touch = e.originalEvent.touches[0];
			touchEndX = touch.pageX;
		});
		$swipeZone.on('touchend', function (e) {
			swipeDelta = (touchEndX - touchStartX);
			if (swipeDelta < -swipeMinX) { //swipe left
				$column.removeClass(column + '_active');
			} else if (swipeDelta > swipeMinX) { //swipe right
				$column.addClass(column + '_active');
			}
		});
	};
	return {
		init: init,
		columnTop: columnTop,
		columnHeight: columnHeight,
		columnBottom: columnBottom,
		getFixed: getFixed,
		setFixed: setFixed,
		delFixed: delFixed,
		onScroll: onScroll,
		initSwipeHandler: initSwipeHandler
	};
};

(function ($) {
	$.fn.nextOrFirst = function(selector) {
		var next = this.next(selector);
		return (next.length) ? next : this.siblings(selector).first();
	};
	$.fn.prevOrLast = function(selector) {
		var prev = this.prev(selector);
		return (prev.length) ? prev : this.siblings(selector).last();
	};
})(jQuery);

$(function() {

	var hash = window.location.hash.replace('#', '');

	var $videoJs = $('.video-js:visible');
	$videoJs.attr('src', function(){return $(this).data('src');})/*.get(0).play()*/;

	var $authFlipper = $('.auth-flipper'),
		authToggleLinks = '.auth-link';
	$(document).on('click', authToggleLinks, function (e) {
		e.preventDefault();
		$authFlipper.toggleClass('flipper_active');
	});
	if (hash == 'auth') {
		$authFlipper.addClass('flipper_active');
	}

	var menuToggleLinks = '.menu__open-link, .menu__close-link';
	$(document).on('click', menuToggleLinks, function (e) {
		e.preventDefault();
		$(this).parents('.menu').toggleClass('menu_active');
	});

	var $skills = $('path.skills__circle-svg-path');
	if ($skills.length) {
		startSkills();
	} //TODO: move to scroll event

	var $sliders = $('.slider');
	$.each($sliders, function (i, item) {
		var slider = Slider(item);
		slider.init();
	});

	//smooth scroll
	$('a[href^="#"]').on('click.smoothscroll', function (e) {
		e.preventDefault();
		var anchor = this.hash,
			$target = $(anchor);
		if ($target.length) {
			$('html, body').stop().animate({
				'scrollTop': $target.offset().top
			}, 500, 'swing', function () {
				window.location.hash = anchor;
			});
		}
	});

	var blogColumn = 'blog-col-1',
		blogMenu = 'blog-menu',
		blogScroll = false;
	if ($('.' + blogColumn).length) {
		blogScroll = BlogScroll(blogColumn, blogMenu);
		blogScroll.init();
	}

	$(window).on('scroll', function() {
		var scrollTop = $(window).scrollTop();
		if (blogScroll) {
			blogScroll.onScroll(scrollTop);
		}
	});

	$(window).on('resize', function() {
		if (blogScroll) {
			blogScroll.delFixed();
			blogScroll = BlogScroll(blogColumn, blogMenu);
			blogScroll.init();
		}
	});

});