function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
      $('#mainHeaderWrap').addClass('stick');
      $('#content').css('margin-top', '80px');
    } else {
      $('#mainHeaderWrap').removeClass('stick');
      $('#content').css('margin-top', '0px');
    }
}

$(function () {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});