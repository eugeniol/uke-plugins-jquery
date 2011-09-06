/*!
 * jQuery uCarousel v0.1
 * http://ukesoft.com/
 *
 * Copyright 2011, Eugenio Lattanzio
 * Licensed under GPL Version 2 licenses.
 * 
 * This plugin requires jQuery $.cookie ( Klaus Hartl/klaus.hartl@stilbuero.de )
 *
 * Date: 3/25/2011
 */
(function() {
    var Carousel = function(element, settings){
        var $this = this,
            options = $.extend( {
                visibles : 3,
                step : 1,
                autoStep : 3,
                speed : 400,
                autoSpeed : 400,
                auto : 1000
            }, settings);

        $.extend($this,{
            options : options,
            element : element
        });

        function intval (v) {
            v = window.parseInt(v);
            return window.isNaN(v) ? 0 : v;
        }

        var t = $(this.element).show(),
            clip = t.find('.carousel-clip');

        t.prepend('<a href="#" class="carousel-prev"></a><a href="#" class="carousel-next"></a>');

        var tira  = clip.find('ul').first(),
            tiles = tira.find('li'),
            firstItem  = tiles.first().addClass('first');

        var w=0;
        tiles.each(function(ix){
            w+=$(this).outerWidth(true);
        });


        var itemWidth = tiles.outerWidth(true),
            marginRight = intval(tiles.first().css('margin-right')),
            clipWidth = tiles.outerWidth() * options.visibles + marginRight * (options.visibles - 1);


        tira.css({width:w, height:tiles.outerHeight(true), position: 'absolute'});
        clip.css({overflow:'hidden', width:clipWidth, position:'relative'});

        if( tiles.length <= options.visibles ) {
            t.find('.carousel-next,.carousel-prev').hide();
            return;
        }

        var is_moving = false,
            stopLast = true,
            stopFirst = true,
            adjustOnStop = false;

        function _speed(){
            return isAuto() ? options.autoSpeed : options.speed;
        }

        function checkArrows() {
            t.find('.carousel-next,.carousel-prev').show();
            if( ! isAuto() ) {
                if( isFirst() ) {
                    t.find('.carousel-prev').hide();
                }
                if( isLast() ) {
                    t.find('.carousel-next').hide();
                }
            }
        }
        function next(step, noAnimate) {
            if( ! is_moving ) {
                is_moving = true;
                if( !step ) { step = 1; }

                if( stopLast ) {
                    var items = tira.children();
                    var ix = items.index(tira.find('.first'));
                    var despues = (ix - step + items.length) % items.length;

                    if( despues >= 0 && despues < options.visibles ) {
                        step = despues ;
                    }
                }

                var childrens = tira.children(), clones = [],
                    cb = function(){
                    while( step > 0) {
                        var c = clones.shift();
                        c.replaceWith( tira.children().first().remove() );
                        step--;
                    }
                    tira.css( 'width', tira.width() - itemWidth * step );
                    checkArrows();
                    tira.css('left',0);
                    is_moving = false;
                };


                for( var i = 0; i < step; i ++) {
                    var c = $(childrens.get(i)).clone();
                    clones.push(c);
                    tira.append(c);
                }

                tira.css( 'width', tira.width() + itemWidth * step );

                if( noAnimate ) {
                    cb();
                }
                else {
                    tira.animate({left: '-=' + (itemWidth * step)}, _speed(), cb);
                }
            }
        }

        function prev(step, noAnimate) {
            if( ! is_moving ) {
                is_moving = true;
                if( !step ) { step = 1; }
                if( stopFirst ) {
                    var items = tira.children();
                    var ix = items.index(tira.find('.first'));

                    var despues = (ix + step + items.length) % items.length;
                    if( despues >  0 && despues < options.visibles ) {
                        step = options.visibles - despues ;
                    }
                }


                var childrens = tira.children(), clones = [] ;
                for( var i = childrens.length - 1; i >= childrens.length - step; i--) {
                    var c = $(childrens.get(i)).clone();
                    clones.push(c);
                    tira.prepend(c);
                }

                tira.css( {'width': tira.width() + itemWidth * step, left : -1 * itemWidth * step });

                var cb = function(){
                    tira.css( 'width', tira.width() - itemWidth * step );
                    while( step > 0) {
                        clones.shift().replaceWith(tira.children().last().remove());
                        step--;
                    }

                    tira.css('left',0);
                    is_moving = false;

                    checkArrows();
                };
                if( noAnimate ) {
                    cb();
                }
                else {
                    tira.animate({left: '0'}, _speed(), cb);
                }
            }
        }

        var autoInterval;

        function isAuto (){
            return autoInterval;
        }

        function isFirst() {
            return tira.children().index( firstItem ) === 0;
        }

        function isLast() {
            return tira.children().get(options.visibles) === firstItem.get(0);
        }

        var currentBackward = false, pauseAuto=false;

        function auto(start, backward, now){
            if( ! options.auto ) {
                return;
            }

            backward = arguments.length > 1 ? backward : false;

            if( start ) {
                if( currentBackward !== backward ) {
                    auto(false);
                }

                if( ! autoInterval ) {
                    currentBackward = backward || false;
                    stopFirst = false;
                    stopLast = false;
                    var cb = function(){
                        if( !pauseAuto ) {
                            if( backward ) {
                                prev( options.autoStep );
                            }
                            else {
                                next( options.autoStep );
                            }
                        }
                    };

                    autoInterval = setInterval(cb, options.auto);

                    if( now ) {
                        cb();
                    }
                }
            }
            else {
                clearInterval(autoInterval);
                autoInterval = 0;

                if( adjustOnStop ) {
                    var ix = tira.children().index( firstItem );
                    if( ix > 0 && ix < options.visibles ){
                        next( ix );
                    }
                }
                stopFirst = true;
                stopLast = true;
            }
        }

        tira.hover(function(){
            pauseAuto = true;
        }, function(){
            pauseAuto = false;
        });

        $.extend(this,{
            next : next,
            prev : prev,
            auto: auto,
            isAuto : isAuto
        });

        t.find('.carousel-next').click(function(){
            if( ! $(this).data('holding') ) {
                auto(false);
                next(options.step);
            }
            return false;
        }).mousedown(function(){ $(this).data('holding', false);
        }).mousehold(function(){
            if( ! $(this).data('holding') ) {
                $(this).data('holding', true);
                auto(true, false, true);
            }
        });

        t.find('.carousel-prev').click(function(){
            if( ! $(this).data('holding') ) {
                auto(false);
                prev(options.step);
            }
            return false;
        }).mousedown(function(){ $(this).data('holding', false);
        }).mousehold(function(){
            if( ! $(this).data('holding') ) {
                $(this).data('holding', true);
                auto(true, true, true);
            }
        });
    };

    $.fn.uCarousel = function(settings) {
        if( $(this).data('uCarousel') ) {
            return   $(this).data('uCarousel');
        }
        return $(this).each(function(){
            $(this).data('uCarousel', new Carousel( this, settings ));
        });
    };
}());

//
//$.fn.carousel = function() {
//    var interval = $('#the-private-bank, #commercial-institutional').length ? 4 : 3;
//    return $(this).each(function(){
//        if( $(this).data('carousel') ) {
//            return;
//        }
//        $(this).data('carousel', {});
//        $(this).show();
//        var carousel = $(this).ukeCarousel({
//            visibles : interval,
//            step :  interval,
//            autoStep : interval ,
//            speed : 400,
//            autoSpeed : 1000,
//            auto :  ub.carousel.interval * 1000
//        }).show().ukeCarousel();
//
//        carousel.auto(true);
//
//        $(this).find('.carousel-prev').hide();
//
//        var items = $(this).find('.carousel-item');
//
//        items.each(function(){
//            if( $(this).find('.more').length ) {
//                $(this).css('cursor', 'pointer');
//            }
//        }).shadow();
//
//        var liveClick = function(event){
//            var more;
//            if( event.target.nodeName === 'A' ) {
//                // prevent direct clicks on the <a> from being called twice
//                more = $(this).find('.more:not([href^="javascript:"])');
//            } else {
//                more = $(this).find('.more');
//            }
//            if( more.length ) {
//                // $('.carousel .carousel-item').removeClass('highlighted');
//                // $(this).addClass('highlighted');
//                items.die('click', liveClick);
//                more.click(); // trigger coremetrics
//                window.location = more.attr('href');
//                items.live('click', liveClick);
//            }
//        };
//
//        items.live('click', liveClick);
//
//        // ADA - Automatically stop rotating the carousel on the landing pages when the user tabs to the first carousel "learn more" link
//        items.live('focus', function(){
//            carousel.auto(false);
//        });
//    });
//};