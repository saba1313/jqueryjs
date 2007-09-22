$.toasterLite = function(settings) {
    settings = $.extend({
        timeout: 3000,
        title: '',
        text: '',
        animationSpeed: 3000,
        location: 'tr',
        container: 'body',
        manualClose: true
    }, settings);
    
    var html = '<div class="ui-toasterLite ui-resizable ui-toasterLite-pos-'+settings.location +'"><div calss="ui-toasterLite-container">';
    if(!!settings.title || settings.manualClose) {
        html += '<div class="ui-toasterLite-titlebar">';
        if (!!settings.title) html += '<span class="ui-toasterLite-title">'+ settings.title +'</span>';
        if (settings.manualClose) html += '<div class="ui-toasterLite-titlebar-close"></div>';
        html += '</div>';
    }
    html += '<div class="ui-toasterLite-content">'+ settings.text +'</div></div>'+
    '<div class="ui-toasterLite-n ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-s ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-e ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-w ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-ne ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-se ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-sw ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-nw ui-toasterLite-corner"/>'+
    '</div>';
    html = $(html);
    
    $toasters = $(settings.container).children('.ui-toasterLite');
    if ($toasters.length) $toasters.before(html[0]);
    else $(settings.container).append(html);
    
    $(html).find('.ui-toasterLite-titlebar-close').hover(function() { $(this).addClass('ui-toasterLite-titlebar-close-hover') }, function() { $(this).removeClass('ui-toasterLite-titlebar-close-hover'); }).click(function() {
        html.fadeOut(settings.animationSpeed, function(){ html.remove(); });
    });
    
    window.setTimeout(function() { html.slideDown(); }, 0);
    if (!settings.manualClose) window.setTimeout(function() { html.slideUp(settings.animationSpeed, function(){ html.remove(); }); }, settings.timeout);
}
