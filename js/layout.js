$(document).ready(function () {
    var AFFIX_TOP_LIMIT = 300;
    var AFFIX_OFFSET = 49;
	$('#menu-left').localScroll({hash:true, onAfterFirst:function(){$('html, body').scrollTo( {top:'-=25px'}, 'fast' );}});
    var $menu = $("#menu"),
		$btn = $("#menu-toggle");

    $("#menu-toggle").on("click", function () {
        $menu.toggleClass("open");
        return false;
    });


    $(".docs-nav").each(function () {
        var $affixNav = $(this),
			$container = $affixNav.parent(),
			affixNavfixed = false,
			originalClassName = this.className,
			current = null,
			$links = $affixNav.find("a");

        function getClosestHeader(top) {
            var last = $links.first();

            if (top < AFFIX_TOP_LIMIT) {
                return last;
            }

            for (var i = 0; i < $links.length; i++) {
                var $link = $links.eq(i),
					href = $link.attr("href");

                if (href.charAt(0) === "#" && href.length > 1) {
                    var $anchor = $(href).first();

                    if ($anchor.length > 0) {
                        var offset = $anchor.offset();

                        if (top < offset.top - AFFIX_OFFSET) {
                            return last;
                        }

                        last = $link;
                    }
                }
            }
            return last;
        }


        $(window).on("scroll", function (evt) {
            var top = window.scrollY,
		    	height = $affixNav.outerHeight(),
		    	max_bottom = $container.offset().top + $container.outerHeight(),
		    	bottom = top + height + AFFIX_OFFSET;

            if (affixNavfixed) {
                if (top <= AFFIX_TOP_LIMIT) {
                    $affixNav.removeClass("fixed");
                    $affixNav.css("top", 0);
                    affixNavfixed = false;
                } else if (bottom > max_bottom) {
                    $affixNav.css("top", (max_bottom - height) - top);
                } else {
                    $affixNav.css("top", AFFIX_OFFSET);
                }
            } else if (top > AFFIX_TOP_LIMIT) {
                $affixNav.addClass("fixed");
                affixNavfixed = true;
            }

            var $current = getClosestHeader(top);

            if (current !== $current) {
                $prevActive = $affixNav.find(".active");
                $prevActive.removeClass("active");
                $prevActive.closest('.sub-items').removeClass('visible');
                $prevActive.closest('.inner-sub-items').removeClass('visible');
                
                $current.addClass("active");
                $current.closest('.sub-items').addClass('visible');
                $current.closest('.inner-sub-items').addClass('visible');
                
                current = $current;

            }
        });
    });

    prettyPrint();

    $(".logo").hover(function(event) {
        $(this).removeClass().addClass('rubberBand animated logo').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).removeClass();
        });
    }, function(){});
});
