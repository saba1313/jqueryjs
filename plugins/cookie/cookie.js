/**
 * Sets/gets a cookie with the given name and value and other optional parameters.
 *
 * @param name the name of the cookie
 * @param value the value of the cookie
 * @return the value of the cookie
 * @example $.cookie('the_cookie');
 * @example $.cookie('the_cookie', 'the_value');
 * @example $.cookie('the_cookie', 'the_value', {expires: , path: '/', domain: 'jquery.com', secure: true});
 * @name cookie
 * @type jQuery
 * @author Klaus Hartl (16.09.2006)
 *
 * @param expires an integer specifying the expiration date from now on
 *                in days. If you set the number of days to 0 the cookie
 *                is trashed when the user closes the browser.
 * @param path    path where the cookie is valid (default: path of
 *                calling document).
 * @param domain  domain where the cookie is valid (default: domain of
 *                calling document).
 * @param secure  boolean value indicating if the cookie transmission
 *                requires a secure transmission.
 */

/**
 * Deletes a cookie by setting the expiry date in the past.
 *
 * @example $.cookie('name', '', -1);
 */

$.cookie = function(name, value, options) {
    if (typeof value == 'string') { // // name and value given, set cookie
        options = options || {};
        var expires = '';
        if (typeof options.expires == 'number') {
            var date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
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