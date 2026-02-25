export function bounceInText($text) {
  $text.each(function () {
    $(this).textillate({
      initialDelay: 1200,
      in: {
        effect: 'bounceIn',
        reverse: true,
        delay: 110,
      },
    });
  });
}
