// Cookie Plugin

/**
 * Sets/gets a cookie with the given name and value and other optional parameters.
 *
 * @param String Name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Hash options A set of key/value pairs for optional cookie parameters.
 *
 * These are all the key/values that can be passed in to 'options':
 *
 * (Integer|Date) expires - Either an integer specifying the expiration date from now on in days or a Date object.
 *
 * (String) path - Path where the cookie is valid (default: path of calling document).
 * 
 * (String) domain - Domain where the cookie is valid (default: domain of calling document).
 *
 * (Boolean) secure - Boolean value indicating if the cookie transmission requires a secure transmission.
 *
 * @return The value of the cookie.
 * @name $.cookie
 * @type jQuery
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain: 'jquery.com', secure: true});
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value', {expires: 0});
 * @desc Create a cookie that is trashed if the browser is closed (session cookie).
 * @example $.cookie('the_cookie', '', {expires: -1});
 * @desc Delete a cookie by setting the expiry date in the past.
 */
$.cookie = function(name, value, options) {
    if (typeof value == 'string') { // name and value given, set cookie
        options = options || {};
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toGMTString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toGMTString();
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', value, expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
    }
};