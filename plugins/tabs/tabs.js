/*
 * Tabs - jQuery plugin for accessible, unobtrusive tabs http://stilbuero.de/tabs/
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * v1.5
 */
$.fn.tabs = function(options) {
    // configuration
    var ON_CLASS = 'on';
    var OFF_CLASS = 'tabs-hide';
    // options
    options = options || {};
    options['activeTab'] = (options.on && typeof options.on == 'number' && options.on > 0) ? options.on - 1 : 0;
    if ((options.fxSlide || options.fxFade || options.fxAnimate) && !options.fxSpeed) {
        options['fxSpeed'] = 'normal';
    }
    options['fxAnimate'] = options.fxAnimate || null;
    var re = /([_\-\w]+$)/i;
    return this.each(function() {
        // retrieve active tab from hash in url
        if (location.hash) {
            var hashId = location.hash.replace('#', '');
            $(this).find('>ul>li>a').each(function(i) {
                if (re.exec(this.href)[1] == hashId) {
                    options.activeTab = i;
                    function _unFocus() { // required to not scroll to fragment
                        scrollTo(0, 0);
                    }
                    // be nice to IE via Conditional Compilation
                    // this needs to preceed call to unFocus for other browsers
                    /*@cc_on
                    setTimeout(_unFocus, 150); // IE needs a little timeout here
                    @*/
                    _unFocus();
                    setTimeout(_unFocus, 100); // be nice to Opera
                }
            });
        }
        if (options.fxAutoheight) {
            var divs = $(this).find('>div');
            var heights = [];
            divs.each(function(i) {
                heights.push( this.offsetHeight );
                if (options.activeTab != i) {
                    $(this).addClass(OFF_CLASS);
                }
            });
            heights.sort(function(a, b) {
                return b - a;
            });
            divs.each(function() {
                $(this).css({minHeight: heights[0] + 'px'});
                /*@cc_on
                // IE 6 only...
                if (typeof XMLHttpRequest == 'function') $(this).css({height: heights[0] + 'px'});
                @*/
            });
        } else {
            $(this).find('>div').not(':eq(' + options.activeTab + ')').addClass(OFF_CLASS);
        }
        $(this).find('>ul>li:eq(' + options.activeTab + ')').addClass(ON_CLASS);
        var container = this;
        $(this).find('>ul>li>a').click(function() {
            // save scrollbar position
            var scrollX = window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft || 0;
            var scrollY = window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (!$(this.parentNode).is('.' + ON_CLASS)) {
                var tabToShow = $('#' + re.exec(this.href)[1]);
                if (tabToShow.size() > 0) {
                    var self = this;
                    var tabToHide = $(container).find('>div:visible');
                    var callback;
                    if (options.callback && typeof options.callback == 'function') {
                        callback = function() {
                            options.callback.apply(tabToShow[0], [tabToShow[0], tabToHide[0]]);
                        }
                    }
                    function _activateTab() {
                        $(container).find('>ul>li').removeClass(ON_CLASS);
                        $(self.parentNode).addClass(ON_CLASS);
                    }
                    var showAnim = {}, hideAnim = {};
                    if (options.fxAnimate) {
                        showAnim = $.extend(showAnim, options.fxAnimate[0]); // copy object
                        hideAnim = $.extend(hideAnim, options.fxAnimate[1]); // copy object
                    } else if (options.fxSlide || options.fxFade) {
                        if (options.fxSlide) {
                            showAnim['height'] = 'show';
                            hideAnim['height'] = 'hide';
                        }
                        if (options.fxFade) {
                            showAnim['opacity'] = 'show';
                            hideAnim['opacity'] = 'hide';
                        }
                    } else {
                        options['fxSpeed'] = 1;
                        showAnim['opacity'] = 'show';
                        hideAnim['opacity'] = 'hide';
                    }
                    if (showAnim) {
                        tabToHide.animate(hideAnim, options.fxSpeed, function() {
                            _activateTab();
                            tabToShow.removeClass(OFF_CLASS).animate(showAnim, options.fxSpeed, function() {
                                /*@cc_on
                                tabToHide[0].style.filter = '';  // @ IE, retain acccessibility for print
                                tabToHide.addClass(OFF_CLASS).css({display: '', height: 'auto'}); // retain flexible height and acccessibility for print
                                @*/
                                tabToShow.css({height: 'auto'}); // retain flexible height
                                if (callback) callback();
                            });
                        });
                    } else {
                        tabToHide.addClass(OFF_CLASS);
                        _activateTab();
                        tabToShow.removeClass(OFF_CLASS);
                        if (callback) callback();
                    }
                } else {
                    alert('There is no such container.');
                }
            }
            // Set scrollbar to saved position
            setTimeout(function() {
                window.scrollTo(scrollX, scrollY)
            }, 0);
        });
    });
};
$.fn.triggerTab = function(tabIndex) {
    var i = tabIndex && tabIndex > 0 && tabIndex - 1 || 0;
    return this.each(function() {
        $(this).find('>ul>li>a').eq(i).click();
    });
};