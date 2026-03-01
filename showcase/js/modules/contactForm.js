export function initContactForm() {
  const form = document.getElementById('contactForm');
  const messageEl = document.getElementById('formMessage');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const response = await fetch('php/contact.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    // Show message
    messageEl.textContent = result.message;
    messageEl.style.display = 'inline-block';

    if (result.status === 'success') {
      messageEl.style.backgroundColor = '#2e7d32';
      messageEl.style.color = '#fff';
      form.reset();
    } else {
      messageEl.style.backgroundColor = '#c62828';
      messageEl.style.color = '#fff';
    }
  });
}
