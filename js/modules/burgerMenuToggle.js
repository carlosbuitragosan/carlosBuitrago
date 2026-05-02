export function burgerMenuToggle($burgerMenu) {
  $burgerMenu.on('change', function () {
    $('.navbar')
      .toggleClass('show', $(this).is(':checked'))
      .toggleClass('hide', !$(this).is(':checked'));
  });
}
