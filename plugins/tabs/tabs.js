// tabs - jQuery plugin for accessible, unobtrusive tabs by Klaus Hartl
// v 1.0
// http://stilbuero.de/tabs/
// Free beer and free speech. Enjoy!
$.fn.tabs = function(options) {
    
    // basic stuff
    var ON_CLASS = 'on';
    var OFF_CLASS = 'tabs-hide';
    
    // options
    var on = options && options.on && (typeof options.on == 'number' && options.on > 0) ? options.on - 1 : 0;
    
    return this.each(function() {    
        //$(this).find('>div').not(':eq(' + on + ')').hide();
        $(this).find('>div').not(':eq(' + on + ')').addClass(OFF_CLASS);
        $(this).find('>ul>li:nth-child(' + on + ')').addClass(ON_CLASS);
        var container = this;
        $(this).find('>ul>li>a').click(function() {
            if (!$(this.parentNode).is('.' + ON_CLASS)) {
                var re = /([_\-\w]+$)/i;
                var target = $('#' + re.exec(this.href)[1]);
                if (target.size() > 0) {
                    //$(container).find('>div:visible').hide();
                    $(container).find('>div:visible').addClass(OFF_CLASS);
                    //target.show();
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