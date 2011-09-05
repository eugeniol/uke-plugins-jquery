/*!
 * jQuery printTarget v0.1
 * http://ukesoft.com/
 *
 * Copyright 2011, Eugenio Lattanzio
 * Licensed under GPL Version 2 licenses.
 *
 * Date: 05/09/2011 03:05:08 p.m.
 */
 (function($){
	$.fn.printTarget = function() {
		var t = $(this);
		
		if( ! t.length ) {
			return t; 
		}
		else if ( t.length > 1 ) {
			return t.first().printTarget();
		}
		
		var strFrameName = ("printer-" + (new Date()).getTime()),
			href = t.attr('href'),
			jFrame = $( "<iframe name='" + strFrameName + "' src='"+ href + "'>" ),
			objFrame;
	
		// Hide the frame (sort of) and attach to the body.
		jFrame
			.css( "width", "1px" )
			.css( "height", "1px" )
			.css( "position", "absolute" )
			.css( "left", "-9999px" )
			.appendTo( $( "body:first" ) )
			;
	
		objFrame = window.frames[ strFrameName ];
		
		// Print the document.
		objFrame.onload = function(){
			objFrame.focus();
			objFrame.print();
		};
		
		// Have the frame remove itself in about a minute so that
		// we don't build up too many of these frames.
		setTimeout(function(){
			jFrame.remove();
		}, (60 * 1000));
		
		return t;
	};
}(jQuery));