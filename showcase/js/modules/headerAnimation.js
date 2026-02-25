export function toggleHeaderOnScroll($header) {
  let headerVisible = true;
  const $logoTitle = $('.logo__title');

  // this function triggers with each scroll.
  $(window).on('scroll', function () {
    let lastScrollTop = 0;
    const currentScroll = $(this).scrollTop(); // distance of page from the top. it's only defined when you start scrolling.

    if (headerVisible && currentScroll > 150) {
      $header.slideUp('fast');
      headerVisible = false;
    } else if (!headerVisible && currentScroll <= 150) {
      $header.slideDown('fast');
      $logoTitle.css('visibility', 'visible').textillate('in');
      headerVisible = true;
    }
    lastScrollTop = currentScroll;
  });
}
