export function initVideoModal() {
  const cards = document.querySelectorAll('.portfolio__card');
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');
  const closeBtn = document.querySelector('.modal__close');
  const overlay = document.querySelector('.modal__overlay');
  const githubLinks = document.querySelectorAll('.card__link a');

  githubLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  cards.forEach((card) => {
    const videoURL = card.dataset.video;
    if (!videoURL) return;
    else {
      card.style.cursor = 'pointer';
    }

    card.addEventListener('click', () => {
      iframe.src = videoURL + '?autoplay=1&mute=1';
      modal.classList.add('active');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    iframe.src = ''; // stops the video
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}
