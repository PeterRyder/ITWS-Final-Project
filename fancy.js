function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
      $('#mainHeader').addClass('stick');
      $('#content').css('margin-top', '58px');
    } else {
      $('#mainHeader').removeClass('stick');
      $('#content').css('margin-top', '0px');
    }
}

$(function () {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});