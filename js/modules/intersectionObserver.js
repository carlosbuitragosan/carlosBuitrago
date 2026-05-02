export function createIntersectionObserver(
  handleIntersection,
  onExit,
  options
) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleIntersection(entry, observer);
      } else {
        onExit?.(entry, observer);
      }
    });
  }, options);
}
