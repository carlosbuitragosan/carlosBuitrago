document
  .getElementById('contactForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const response = await fetch('php/contact.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    document.getElementById('formMessage').textContent = result.message;
    form.reset();
  });
