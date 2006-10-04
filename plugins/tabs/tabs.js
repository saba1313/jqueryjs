 // tabs - jQuery plugin for accessible, unobtrusive tabs by Klaus Hartl
// v 1.1
// http://stilbuero.de/tabs/
// Free beer and free speech. Enjoy!
$.fn.tabs = function(options) {
    // basic stuff
    var ON_CLASS = 'on';
    var OFF_CLASS = 'tabs-hide';
    // options
    var on = options && options.on && (typeof options.on == 'number' && options.on > 0) ? options.on - 1 : 0;
    return this.each(function() {
        var re = /([_\-\w]+$)/i;
        // retrieve active tab from hash in url
        if (location.hash) {
            var hashId = location.hash.replace('#', '');
            $(this).find('>ul>li>a').each(function(i) {
                if (re.exec(this.href)[1] == hashId) {
                    on = i;
                    var unFocus = function() { // required to not scroll to fragment
                        scrollTo(0, 0);
                    }
                    // be nice to IE via Conditional Compilation
                    // this needs to preceed call to unFocus for other browsers
                    /*@cc_on
                    //location.replace('#'); // required to not scroll to fragment
                    setTimeout(unFocus, 150); // IE needs a little timeout here
                    @*/
                    unFocus();
                    setTimeout(unFocus, 100); // be nice to Opera
                }
            });
        }
        $(this).find('>div').not(':eq(' + on + ')').addClass(OFF_CLASS);
        $(this).find('>ul>li:eq(' + on + ')').addClass(ON_CLASS);
        var container = this;
        $(this).find('>ul>li>a').click(function() {
            if (!$(this.parentNode).is('.' + ON_CLASS)) {
                var target = $('#' + re.exec(this.href)[1]);
                if (target.size() > 0) {
                    $(container).find('>div:visible').addClass(OFF_CLASS);
                    target.removeClass(OFF_CLASS);
                    $(container).find('>ul>li').removeClass(ON_CLASS);
                    $(this.parentNode).addClass(ON_CLASS);
                } else {
                    alert('There is no such container.');
                }
            }
            return false;
        });
    });
};