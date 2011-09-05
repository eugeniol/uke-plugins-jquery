/*!
 * jQuery ukeTool v0.1
 * http://ukesoft.com/
 *
 * Copyright 2011, Eugenio Lattanzio
 * Licensed under GPL Version 2 licenses.
 * 
 * This plugin requires jQuery $.cookie ( Klaus Hartl/klaus.hartl@stilbuero.de )
 *
 * Date: 3/25/2011
 */
(function($){
    /**
     *
     * @param {Object} options Classes to choose from
     * @param {Number} duration Duration of each class
     * @param {Bool} live Change the class without refresh
     * @param {Bool} incremental Dont remove the previous classes
     */
    $.fn.randomClass = function(options, duration, live, incremental){
        var q = this, key = "hat(" + q.selector + ")", storer = duration && $.cookie ? $.cookie : $.noop, now, data, expire, bg, index, i;
        
        if ($.isPlainObject(options)) {
            $.each(options, function(prefix, max){
                switch (prefix) {
                    case 'duration':
                        duration = max;
                        break;
                    case 'live':
                        live = max;
                        break;
                    case 'incremental':
                        incremental = max;
                        break;
                    default:
                        for (i = 0, options = []; i < max; i++) {
                            options.push(prefix + i);
                        }
                        return false;
                }
            });
        }
        else if (typeof options === 'string') {
            options = options.split(' ');
        }
        
        data = storer(key);

        if (data) {
            data = data.split(' ');
            expire = data[0];
            bg = data[1];
        }
        
        (function(){
            // If the background time expieres the background is recalculated 
            now = (new Date()).getTime();
            
            if ((!expire) || (expire < now)) {
                storer(key, [expire = now + duration * 1000, bg = Math.random()].join(' '));
            }
            
            index = Math.floor(bg * options.length);
            
            if (options[index]) {
                if (!incremental) {
                    q.removeClass(options.join(' '));
                }
                q.addClass(options[index]);
            }
            
            // apply at live without refresh
            if (live) {
                setTimeout(arguments.callee, 1000);
            }
        })();
                
                return this;
    };
})(jQuery, window);