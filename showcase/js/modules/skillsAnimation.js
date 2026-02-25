import { createIntersectionObserver } from './intersectionObserver.js';

export function moveItemsToBottom(container, items) {
  items.forEach((item) => {
    const containerBottom =
      container.getBoundingClientRect().top + container.offsetHeight;
    const itemBottom = item.getBoundingClientRect().top + item.offsetHeight;
    const translateY = containerBottom - itemBottom;
    item.style.transform = `translateY(${translateY}px)`;
  });
}

export function resetTransformItems(items) {
  items.forEach((item) => {
    item.style.transform = 'none';
  });
}

export function resetTransformOnIntersect(container, items) {
  const handleIntersection = (entry, observer) => {
    resetTransformItems(items);
    observer.disconnect();
  };

  const observerInstance = createIntersectionObserver(
    handleIntersection,
    null,
    {
      threshold: 0.5,
    }
  );

  observerInstance.observe(container);
}

export function highlightOnHover(items) {
  items.forEach((hoveredCard) => {
    hoveredCard.addEventListener('mouseenter', () => {
      items.forEach((card) => {
        if (card !== hoveredCard) {
          card.classList.add('skills__category_greyed');
        }
      });
    });
  });
  items.forEach((item) => {
    item.addEventListener('mouseleave', () => {
      items.forEach((card) => {
        card.classList.remove('skills__category_greyed');
      });
    });
  });
}
