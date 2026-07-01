// Skaliert .right-title-text, .slide-subtitle-left und .quote-bg-title so, dass der Text in die Box passt.
// Läuft nach Reveal-Initialisierung, damit alle Slides gerendert sind.

function fitTitleText(el) {
  const isVertical = getComputedStyle(el).writingMode.includes('vertical');
  const overflows  = () => isVertical
    ? el.scrollHeight > el.clientHeight
    : el.scrollWidth  > el.clientWidth;

  const maxSize = 1.4;
  const minSize = 0.6;
  const step    = 0.05;

  let size = maxSize;
  el.style.fontSize = size + 'em';

  while (overflows() && size > minSize) {
    size -= step;
    el.style.fontSize = size + 'em';
  }
}

Reveal.on('ready', ({ currentSlide }) => {
  currentSlide.querySelectorAll('.right-title-text, .slide-subtitle-left, .quote-bg-title, .diagram-title')
    .forEach(fitTitleText);
});

Reveal.on('slidechanged', ({ currentSlide }) => {
  currentSlide.querySelectorAll('.right-title-text, .slide-subtitle-left, .quote-bg-title')
    .forEach(fitTitleText);
});