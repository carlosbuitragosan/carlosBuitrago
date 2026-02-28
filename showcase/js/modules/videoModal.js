export function initVideoModal() {
  const cards = document.querySelectorAll('.portfolio__card');
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');
  const closeBtn = document.querySelector('.modal__close');
  const overlay = document.querySelector('.modal__overlay');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const videoURL = card.dataset.video;
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
