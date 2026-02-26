export function fadeInDownText($text) {
  $text.css('visibility', 'visible').textillate({
    in: {
      effect: 'fadeInDownBig',
      delayScale: 2,
      delay: 16,
    },
  });
}
