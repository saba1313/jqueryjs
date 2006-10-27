/*
 * Tabs 2.0 - jQuery plugin for accessible, unobtrusive tabs http://stilbuero.de/tabs/
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a tab interface based on a certain HTML structure.
 *
 * This is accessible and totally unobtrusive.
 *
 * @example $('#container').tabs();
 * @desc Create a basic tabbed interface, that is based on this HTML structure: ...
 *
 * @name tabs
 * @type jQuery
 * @param Integer initial The tab to be be initially activated.
 * @param Hash settings Object literal containing key/value pairs for optional settings.
 *
 * These are all the key/values that can be passed in to 'settings':
 *
 * (Boolean) fxFade -
 *                    Default value: false
 *
 * (Boolean) fxSlide -
 *                     Default value: false
 *
 * (Object) fxShow -
 *                   Default value: null
 *
 * (Object) fxHide -
 *                   Default value: null
 *
 * (String|Integer) fxSpeed -
 *                            Default value: 'normal'
 *
 * (String|Integer) fxShowSpeed -
 *                                Default value: fxSpeed
 *
 * (String|Integer) fxHideSpeed -
 *                                Default value: fxSpeed
 *
 * (Boolean) fxAutoheight -
 *                          Default value: false
 *
 * (Function) callback -
 *                       Default value: null
 *
 * (String) selectedTabClass -
 *                             Default value: 'selected'
 *
 * (String) hiddenTabContainerClass -
 *                                    Default value: 'tabs-hide'
 *
 * (String) tabSelector -
 *                        Default value: '>div'
 *
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.fn.tabs = function(initial, settings) {

    // settings
    if (typeof initial == 'object') settings = initial; // no initial tab given but a settings object
    settings = jQuery.extend({
        initial: (initial && typeof initial == 'number' && initial > 0) ? --initial : 0,
        fxFade: null,
        fxSlide: null,
        fxShow: null,
        fxHide: null,
        fxSpeed: 'normal',
        fxShowSpeed: null,
        fxHideSpeed: null,
        fxAutoheight: false,
        callback: null,
        selectedTabClass: 'selected',
        hiddenTabContainerClass: 'tabs-hide',
        tabSelector: '>div'
    }, settings || {});

    // regex to find hash in url
    var re = /([_\-\w]+$)/i;

    // observer to fix back button
    //if (jQuery.history) jQuery.history.observe();

    // helper to prevent scroll to fragment
    var _unFocus = function() {
        scrollTo(0, 0);
    };

    // initialize tabs
    return this.each(function() {

        // retrieve active tab from hash in url
        if (location.hash) {
            var hashId = location.hash.replace('#', '');
            jQuery('>ul:eq(0)>li>a', this).each(function(i) {
                if (re.exec(this.href)[1] == hashId) {
                    settings.initial = i;
                    if (jQuery.browser.msie) setTimeout(_unFocus, 150); // be nice to IE
                    _unFocus();
                    if (jQuery.browser.opera) setTimeout(_unFocus, 100); // be nice to Opera
                }
            });
        }

        // hide tabs other than initial, set autoheight if needed
        if (settings.fxAutoheight) {
            var divs = jQuery(settings.tabSelector, this);
            var heights = [];
            divs.each(function(i) {
                heights.push( this.offsetHeight );
                if (settings.initial != i) jQuery(this).addClass(settings.hiddenTabContainerClass);
            });
            heights.sort(function(a, b) {
                return b - a;
            });
            divs.each(function() {
                jQuery(this).css({minHeight: heights[0] + 'px'});
                if (jQuery.browser.msie && typeof XMLHttpRequest == 'function') jQuery(this).css({height: heights[0] + 'px'});
            });
        } else {
            jQuery(settings.tabSelector, this).not(':eq(' + settings.initial + ')').addClass(settings.hiddenTabContainerClass);
        }

        // highlight tab in navigation
        jQuery('>ul>li:eq(' + settings.initial + ')', this).addClass(settings.selectedTabClass);

        // attach events
        var container = this;
        jQuery('>ul>li>a', this).click(function(e) {

            // id of tab to be activated
            var tabToShowId = re.exec(this.href)[1];

            // update observer TODO: find another way to add event...
            //if (jQuery.history) jQuery.history.setHash(tabToShowHash, e);

            if (!jQuery(this.parentNode).is('.' + settings.selectedTabClass)) {
                var tabToShow = jQuery('#' + tabToShowId);

                // prevent scrollbar scrolling to 0 and than back in IE7
                if (jQuery.browser.msie) {
                    tabToShow.id('');
                    setTimeout(function() {
                        tabToShow.id(tabToShowId); // restore id
                    }, 0);
                }

                if (tabToShow.size() > 0) {
                    var _activateTab = function() {
                        jQuery('>ul>li', container).removeClass(settings.selectedTabClass);
                        jQuery(self.parentNode).addClass(settings.selectedTabClass);
                    };
                    var self = this;
                    var tabToHide = jQuery(settings.tabSelector + ':visible', container);
                    var callback;
                    if (settings.callback && typeof settings.callback == 'function') callback = function() {
                        settings.callback.apply(tabToShow[0], [tabToShow[0], tabToHide[0]]);
                    };

                    var showAnim = {}, hideAnim = {};
                    var showSpeed, hideSpeed;
                    if (settings.fxSlide || settings.fxFade) {
                        if (settings.fxSlide) {
                            showAnim['height'] = 'show';
                            hideAnim['height'] = 'hide';
                        }
                        if (settings.fxFade) {
                            showAnim['opacity'] = 'show';
                            hideAnim['opacity'] = 'hide';
                        }
                        showSpeed = hideSpeed = settings.fxSpeed;
                    } else {
                        if (settings.fxShow) {
                            showAnim = jQuery.extend(showAnim, settings.fxShow); // copy object
                            showSpeed = settings.fxShowSpeed || settings.fxSpeed;
                        } else {
                            showAnim['opacity'] = 'show';
                            showSpeed = 1; // as little as this prevents browser scroll to the tab
                        }
                        if (settings.fxHide) {
                            hideAnim = jQuery.extend(hideAnim, settings.fxHide); // copy object
                            hideSpeed = settings.fxHideSpeed || settings.fxSpeed;
                        } else {
                            hideAnim['opacity'] = 'hide';
                            hideSpeed = 1; // as little as this prevents browser scroll to the tab
                        }
                    }
                    tabToHide.animate(hideAnim, hideSpeed, function() { // animate in any case, prevents browser scroll to the fragment
                        _activateTab();
                        tabToShow.removeClass(settings.hiddenTabContainerClass).animate(showAnim, showSpeed, function() {
                            if (jQuery.browser.msie) {
                                tabToHide[0].style.filter = '';  // @ IE, retain acccessibility for print
                                tabToHide.addClass(settings.hiddenTabContainerClass).css({display: '', height: 'auto'}); // retain flexible height and acccessibility for print
                            }
                            tabToShow.css({height: 'auto'}); // retain flexible height
                            if (callback) callback();
                        });
                    });

                } else {
                    alert('There is no such container.');
                }
            }

            // Set scrollbar to saved position - need to use timeout with 0 to prevent browser scroll to target of hash
            var scrollX = window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft || 0;
            var scrollY = window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop || 0;
            setTimeout(function() {
                window.scrollTo(scrollX, scrollY);
            }, 0);

        });
    });

};

/**
 * Activate a tab programmatically with the given position (no zero-based index),
 * as if the tab itself were clicked.
 *
 * @example $('#container').triggerTab(2);
 * @desc Activate the second tab of the tabs interface contained in <div id="container">.
 * @example $('#container').triggerTab(1);
 * @desc Activate the first tab of the tabs interface contained in <div id="container">.
 * @example $('#container').triggerTab();
 * @desc Activate the first tab of the tabs interface contained in <div id="container">.
 *
 * @name triggerTab
 * @type jQuery
 * @param Integer initial The position of the tab to be activated (no zero-based index).
 *                        If this parameter is omitted, the first tab will be activated.
 *
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
// TODO: issue with mixing history and triggerTab
// maybe solved with links that should trigger tab by pointing to corresponding hash
jQuery.fn.triggerTab = function(tabIndex) {
    return this.each(function() {
        jQuery.tabs.trigger(tabIndex, this);
    });
};

// internal helper
jQuery.tabs = new function() {
    this.trigger = function(arg, context) {
        var argType = typeof arg;
        if (argType == 'string') { // id of associated container has been passed
            jQuery(hash).parent('div').find('>ul>li>a[@href$=' + hash + ']').click();
        } else if (argType == 'undefined' || argType == 'number') { // index of tab has been passed
            var tabIndex = arg && arg > 0 && arg - 1 || 0; // falls back to index 0
            jQuery('>ul>li>a', context).eq(tabIndex).click();
        }
    };
};