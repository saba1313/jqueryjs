$(function() {
  $('#container a[@href^=http]').not('[@href*=jquery.com]').addClass('external');
});
