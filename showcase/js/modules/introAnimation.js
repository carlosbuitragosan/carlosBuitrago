import { createIntersectionObserver } from './intersectionObserver.js';

export function fadeInUpText($text) {
  const handleIntersection = (entry, observer) => {
    $text.textillate({
      in: {
        effect: 'fadeInUp',
        sync: true,
      },
    });
    observer.unobserve(entry.target);
  };

  const observerInstance = createIntersectionObserver(
    handleIntersection,
    null,
    {
      threshold: 0.6,
    }
  );

  observerInstance.observe($text[0]);
}
