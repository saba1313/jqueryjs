/**
 * Star Rating - jQuery plugin
 *
 * Copyright (c) 2006 Wil Stuckey
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

// modified from http://sandbox.wilstuckey.com/jquery-ratings/js/jquery.rating.js
 
/**
 * 
 * Create a degradeable star rating interface out of a simple form structure.
 * Returns a modified jQuery object containing the new interface.
 * 
 * @name star rating
 * @author wstuckey 
 *  
 * @example jQuery('form.rating').rating();
 * @cat plugin
 * @type jQuery 
 */
(function($){ //create local scope
    /**
     * Takes the form element, builds the rating interface and attaches the proper events.
     * @param {Object} $obj
     */
    var buildRating = function($obj){
        var $obj = buildInterface($obj),
            averageIndex = $obj.averageRating[0],
            averagePercent = $obj.averageRating[1],
            $stars = $($obj.children('.star')),
            $cancel = $($obj.end().children('.cancel'));
        $obj.end();
        
        // hover events.
        // and focus events added
        $stars
            .mouseover(function(){
                event.drain();
                event.fill(this);
                $('#rating-text-' + $obj.nid).html(this.firstChild.title);
            })
            .mouseout(function(){
                event.drain();
                event.reset();
                $('#rating-text-' + $obj.nid).html('');;
            })
            .focus(function(){
                event.drain();
                event.fill(this);
                $('#rating-text-' + $obj.nid).html(this.firstChild.title);
            })
            .blur(function(){
                event.drain();
                event.reset();
                $('#rating-text-' + $obj.nid).html('');;
            });
            
        // cancel button events
        $cancel
            .mouseover(function(){
                event.drain();
                $(this).addClass('on')
            })
            .mouseout(function(){
                event.reset();
                $(this).removeClass('on')
            })
            .focus(function(){
                event.drain();
                $(this).addClass('on')
            })
            .blur(function(){
                event.reset();
                $(this).removeClass('on')
            });
            
            // click events.
        $cancel.click(function(){
            event.drain();
            averageIndex = 0;
            averagePercent = 0;
            var index = $('#rating-options-' + $obj.nid).rating_option($(this).children('a')[0].href.split('#')[1]);
            $('#rating-options-' + $obj.nid).get(0).selectedIndex = index;
            rating_submit_rating($obj.nid);
            return false;
        });
        $stars.click(function(){
            averageIndex = $stars.index(this) + 1;
            averagePercent = 0;
            var index = $('#rating-options-' + $obj.nid).rating_option($(this).children('a')[0].href.split('#')[1]);
            $('#rating-options-' + $obj.nid).get(0).selectedIndex = index;
            rating_submit_rating($obj.nid);
            return false;
        });
        
         var event = {
            fill: function(el){ // fill to the current mouse position.
                var index = $stars.index(el) + 1;
                $stars
                    .children('a').css('width', '100%').end()
                    .lt(index).addClass('hover').end();
            },
            drain: function() { // drain all the stars.
                $stars
          .filter('.on').removeClass('on').end()
          .filter('.hover').removeClass('hover').end();
            },
            reset: function(){ // Reset the stars to the default index.
                $stars.lt(averageIndex).addClass('on').end();
                var percent = (averagePercent) ? averagePercent * 10 : 0;
                if (percent > 0) {
                    $stars.eq(averageIndex).addClass('on').children('a').css('width', percent + "%").end().end()
                }  
            }
        }        
        event.reset();
        return $obj;
    }
    
    /**
     * Accepts jQuery object containing a form element.
     * Returns the proper div structure for the star interface.
     * 
     * @return jQuery
     * @param {Object} $form
     * 
     */
    
    var buildInterface = function($form){
        var $container = $(document.createElement('div')).attr({
            "title": $form.title(),
            "class": $form.attr('class') + '-stars'
        });
        

        $.extend($container, {
            averageRating: $.trim($container.title().split(':')[1]).split('.'),
            nid: $form.attr('id').split('-')[2]
        });
                
        var $optionGroup = $('#rating-options-' + $container.nid).children('option');
        $optionGroup.sort(function(a,b){
            return (a.value-b.value);
        });
        
        for (var i = 0, option; option = $optionGroup[i]; i++){
            if (option.value == "0") {
                $div = $('<div class="cancel"><a href="#0" title="Cancel Rating">Cancel Rating</a></div>');
            } else {
                $div = $('<div class="star"><a class="mod" href="#' + option.value + '" title="' + option.text + '">' + option.value + '</a></div>');
            }
            $container.append($div[0]);   
        }
        
        var $rating_intro = $('#rating-intro-' + $container.nid);
        
        var $rating_intro_text = $(document.createElement('span')).attr({
            "class": 'rating-intro-text'
        }).append($('#rating-options-' + $container.nid).title() + ': ');
        
        $rating_intro.append($rating_intro_text);
        
        $rating_intro.append($(document.createElement('span')).attr({
            "id": 'rating-text-' + $container.nid,
            "class": 'rating-text'
        }));
        
        var $rating_message = $(document.createElement('span')).attr({
            "id": 'rating-message-' + $container.nid,
            "class": 'rating-message'
        });
        
        //$rating-message.css({'display': 'inline'});
        
        $rating_intro.append($rating_message);
        
        $form.after($container).hide();
        $container.show();
        return $container;
    }
    
    /**
     * Set up the plugin
     */
    $.fn.rating = function(){
        var stack = [];
        this.each(function(){
            var ret = buildRating($(this));
            stack = $.merge(ret, stack);
        });
        return $(stack);
    }
    
  // fix ie6 background flicker problem.
  if ($.browser.msie == true) {
    document.execCommand('BackgroundImageCache', false, true);
  }
    
})(jQuery)

jQuery.fn.sort = function() {
  return this.pushStack( jQuery.merge( [].sort.apply( this, arguments ), []), [] );
};

jQuery.fn.rating_option = function (value) {
        var select = $(this)[0];
        for ( var i=0; i<select.length; i++ )
        if (select[i].value == value)
            return i;
};

function rating_submit_rating(nid){
    $('#rating-form-' + nid).ajaxSubmit(
        {
            dataType: 'json',
            after: function(data){
                if (data.error){
                    $('#rating-message-' + nid).background('#f55');
                    $('#rating-message-' + nid).html(data.error).fadeIn('slow');
                    return false;
                }
                $('#rating-message-' + nid).background('#ff5');
                $('#rating-message-' + nid).html(data.response).fadeIn('slow').fadeOut('slow');
                
                mean = data.mean.split('.');
                var $obj = $('#rating-mean-stars-' + nid);
                $stars = $($obj.children('.star'));
                $stars.filter('.on').removeClass('on').end();
                $stars.children('a').css('width', '100%').end();               
                $stars.lt(mean[0]).addClass('on').end();
                if (mean[1] > 0){
                  $stars.eq(mean[0]).addClass('on').children('a').css('width', mean[1] * 10 + "%").end().end()
                }
                $('#rating-num-votes-' + nid).html(data.num_votes);
                
                rating_postsubmit(nid);
            }
        }
    );
}

$(document).ready(
    function() {
        try{
            jQuery('form.rating').rating();
        }
        catch(e){};
    }
)
