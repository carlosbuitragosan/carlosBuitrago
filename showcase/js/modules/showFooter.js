import { createIntersectionObserver } from './intersectionObserver.js';

export function showFooter($main, $sentinel, $footer) {
  function updateMainBottomMargin() {
    const $footerHeight = $footer.outerHeight();
    $main.css('margin-bottom', `${$footerHeight}px`);
  }
  // update margin
  updateMainBottomMargin();

  const handleIntersection = () => {
    updateMainBottomMargin();
    $footer.css('z-index', '3');
  };

  const onExit = () => {
    $footer.css('z-index', '-1');
  };

  const observerInstance = createIntersectionObserver(
    handleIntersection,
    onExit
  );

  observerInstance.observe($sentinel[0]);

  $(window).resize(() => {
    updateMainBottomMargin();
  });
}
