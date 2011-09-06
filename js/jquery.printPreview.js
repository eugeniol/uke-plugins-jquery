
function _PrintPreview(content) {
    var links = $('head link').clone().wrapAll('<div/>').parent();

    $('link[media="print"]', links).attr('media', 'all');

    var $html = $( '<div>' +
        '<div class="top-toolbar"><a id="MainPrintButton" class="toolbar-button" onclick="return false" style="cursor: pointer;">Print</a></div>' +
        $('body').html() + '</div>');

    $('.cta-inline-button', $html).hide();

    $('script', $html).remove();

    $('a',$html).attr('onclick', 'return false');

    var logo = $('.logo').css('background-image').replace(/(^url\(\'?\"?|\'?\"?\)$)/g, "").replace(
        /\/[\w\-\.]+$/,'') + '/' + ($('html#the-private-bank').length ? 'logo-2.png' : 'logo-1.png'),
        img = $('<img class="printable-logo"/>').attr('src', logo );

    $('.content',$html).before(img);
    var w = window.open('', '', "location=1,status=1,scrollbars=1,width=960,height=600");
    if( ! w ) { return; }

    w.document.open();
    w.document.write( '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
         "\n<html id='"+$html.attr('id')+"'><head>" +
         links.html() + '</head><body class="printable-version '+$('body').attr('class')+'"><div style="display:none" id="PrintWrapper">' +
         $html.html() + '</div></body></html>');
    w.document.close();

    // w.document.title = document.title + ' - ' + "Printable version";
    if( content ) {
        $('.content ~ *', w.document).hide();
        $('.content', w.document).html(content);
    }

    w.document.getElementById('PrintWrapper').style.display = "block";

    w.document.getElementById('MainPrintButton').onclick = function(){
        w.print();
        w.close();
    };

    w.focus();

    if( $.browser.msie && $.browser.version == 6 ) { $(w.document).pngFix(); }
}
