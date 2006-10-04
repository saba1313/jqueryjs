// tabs - jQuery plugin for accessible, unobtrusive tabs by Klaus Hartl
// v 1.4
// http://stilbuero.de/tabs/
// Free beer and free speech. Enjoy!
$.fn.tabs = function(options) {
    // configuration
    var ON_CLASS = 'on';
    var OFF_CLASS = 'tabs-hide';
    // options
    options = options || {};
    options['activeTab'] = (options.on && typeof options.on == 'number' && options.on > 0) ? options.on - 1 : 0;
    if ((options.fxSlide || options.fxFade) && !options.fxSpeed) {
        options['fxSpeed'] = 'normal';
    }
    var re = /([_\-\w]+$)/i;
    return this.each(function() {
        // retrieve active tab from hash in url
        if (location.hash) {
            var hashId = location.hash.replace('#', '');
            $(this).find('>ul>li>a').each(function(i) {
                if (re.exec(this.href)[1] == hashId) {
                    options.activeTab = i;
                    var unFocus = function() { // required to not scroll to fragment
                        scrollTo(0, 0);
                    };
                    // be nice to IE via Conditional Compilation
                    // this needs to preceed call to unFocus for other browsers
                    /*@cc_on
                    setTimeout(unFocus, 150); // IE needs a little timeout here
                    @*/
                    unFocus();
                    setTimeout(unFocus, 100); // be nice to Opera
                }
            });
        }
        if (options.fxAutoheight) {
            // TODO: $(window).resize();
            var divs = $(this).find('>div');
            var heights = [];
            divs.each(function(i) {
                heights.push( $(this).height() );
                if (options.activeTab != i) {
                    $(this).addClass(OFF_CLASS);
                }
            });
            heights.sort(function(a, b) {
                return b - a;
            });
            divs.each(function() {
                $(this).css({height: heights[0] + 'px'});
            });
        } else {
            $(this).find('>div').not(':eq(' + options.activeTab + ')').addClass(OFF_CLASS);
        }
        $(this).find('>ul>li:eq(' + options.activeTab + ')').addClass(ON_CLASS);
        var container = this;
        $(this).find('>ul>li>a').click(function() {
            if (!$(this.parentNode).is('.' + ON_CLASS)) {
                var target = $('#' + re.exec(this.href)[1]);
                if (target.size() > 0) {
                    var self = this;
                    var visible = $(container).find('>div:visible');
                    var callback;
                    if (options.callback && typeof options.callback == 'function') {
                        callback = function() {
                            options.callback.apply(target, [target[0], visible[0]]);
                        }
                    }
                    var activateTab = function() {
                        $(container).find('>ul>li').removeClass(ON_CLASS);
                        $(self.parentNode).addClass(ON_CLASS);
                    };
                    if (options.fxSlide && options.fxFade) {
                        visible.animate({height: 'hide', opacity: 'hide'}, options.fxSpeed, function() {
                            activateTab();
                            target.animate({height: 'show', opacity: 'show'}, options.fxSpeed, function() {
                                /*@cc_on visible[0].style.filter = ''; @*/ // @ IE, retain acccessibility for print
                                visible.addClass(OFF_CLASS).css({display: '', height: 'auto'}); // retain flexible height and acccessibility for print
                                target.addClass(OFF_CLASS).css({height: 'auto'}); // retain flexible height
                                if (callback) callback();
                            });
                        });
                    } else if (options.fxSlide) {
                        visible.slideUp(options.fxSpeed, function() {
                            activateTab();
                            target.slideDown(options.fxSpeed, function() {
                                visible.addClass(OFF_CLASS).css({display: '', height: 'auto'}); // retain flexible height and acccessibility for print
                                target.addClass(OFF_CLASS).css({height: 'auto'}); // retain flexible height
                                if (callback) callback();
                            });
                        });
                    } else if (options.fxFade) {
                        visible.fadeOut(options.fxSpeed, function() {
                            activateTab();
                            target.fadeIn(options.fxSpeed, function() {
                                /*@cc_on visible[0].style.filter = ''; @*/ // @ IE, retain acccessibility for print
                                visible.addClass(OFF_CLASS).css({display: ''}); // retain acccessibility for print and other media types
                                if (callback) callback();
                            });
                        });
                    } else {
                        visible.addClass(OFF_CLASS);
                        activateTab();
                        target.removeClass(OFF_CLASS);
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    alert('There is no such container.');
                }
            }
            return false;
        });
    });
};
$.fn.triggerTab = function(tabIndex) {
    var i = tabIndex && tabIndex > 0 && tabIndex - 1 || 0;
    return this.each(function() {
        $(this).find('>ul>li>a').eq(i).click();
    });
};