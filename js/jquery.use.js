/*!
 * jQuery ukeTool v0.1
 * jquery.use.js
 * http://ukesoft.com/
 *
 * Copyright 2011, Eugenio Lattanzio
 * Licensed under GPL Version 2 licenses.
 *
 * Date: 3/25/2011
 */
(function($) {
	var loaded = {}, loading = {}, scriptUrl = ($('script').last().attr('src') || "")
			.replace(/(\/|^)[\w\.\-]+$/, '$1'), links = $('link[rel="stylesheet"]'), urlCss = (links
			.attr('href') || "").replace(/(\/|^)[\w\.\-]+$/, '$1'), pluginMask = 'jquery.%s.js';

	// usage use('my.css my.js', callbackWhenBothLoads )
	$.use = function(lib, callback, scope) {
		var counter = 0;
		if (!lib) {
			return;
		}
		if (!callback) {
			callback = $.noop;
		}
		lib = lib.split(' ');
		function cb() {
			// caching loaded lib with the filename
			var file = this.url; // .replace(/^(.*\/)?(.+)$/, '$2');
			loaded[file] = true;
			counter++;
			if ((counter) === lib.length) {
				if (loading[file]) {
					$.each(loading[file], function() {
						this.call(scope, $);
					});
					delete loading[file];
				} else {
					callback.call(scope, $);
				}
			}
		}

		$.each(lib, function(k, v) {
			if (loaded[scriptUrl + this]) {
				cb.call({
					url : this
				});
			} else if (loading[scriptUrl + this]) {
				loading[scriptUrl + this].push(callback);
			} else {
				// begin loading;
				loading[scriptUrl + this] = [ callback ];
				if (this.match(/\.css$/)) {
					$.get(urlCss + this, function(data) {
						links.first().after(
								'<style type="text/css">/*<![CDATA[*/' + data
										+ '/*]]>*/</style>');
						cb.call(this);
					});
				} else {
					$.getScript(scriptUrl + this, cb);
				}
			}
		});
	};

	// TODO: refact this
	$.use.setup = function(data) {
		$.each(data, function(key, value) {
			switch (key) {
			case 'scriptUrl':
				scriptUrl = value;
				break;
			case 'cssUrl':
				urlCss = value;
				break;
			case pluginMask:
				pluginMask = value;
				break;
			}
		});
	};

	$.fn.use = function(plugin, params, callback) {
		var q = this, call = !plugin.match(/\./), lib = !call ? plugin
				: pluginMask.replace(/%s/g, plugin);

		if (typeof params === 'function') {
			callback = params;
			params = [];
		}

		if (typeof params === 'undefined') {
			params = [];
		}

		callback = callback || $.noop;

		$.use(lib, function() {
			if (call && typeof q[plugin] === 'function') {
				q[plugin].apply(this, params);
			}

			callback.call(this);
		}, this);
	}
})(jQuery);