export function initDropdownMenu() {
  const dropdown = document.querySelector('.menu__item--dropdown > a');
  if (!dropdown) return;

  const dropdownItem = dropdown.parentElement;

  // Toggle dropdown on click
  dropdown.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownItem.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownItem.contains(e.target)) {
      dropdownItem.classList.remove('active');
    }
  });

  dropdownItem.querySelectorAll('.dropdown a').forEach((link) => {
    link.addEventListener('click', () => {
      dropdownItem.classList.remove('active');
    });
  });
}