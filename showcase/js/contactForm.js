export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    const response = await fetch('php/contact.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    document.getElementById('formMessage').textContent = result.message;
    form.reset();
  });
}
