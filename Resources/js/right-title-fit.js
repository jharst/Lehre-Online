// title-fit.js
// Skaliert .right-title-text und .slide-subtitle-left so, dass der Text in die Box passt.
// Läuft nach Reveal-Initialisierung, damit alle Slides gerendert sind.

Reveal.on('ready', () => {
  document.querySelectorAll('.right-title-text, .slide-subtitle-left, .quote-bg-title').forEach(el => {
    const isVertical = getComputedStyle(el).writingMode.includes('vertical');
    const overflows  = () => isVertical
      ? el.scrollHeight > el.clientHeight
      : el.scrollWidth  > el.clientWidth;
    const maxSize = 1.3;   // em – entspricht --vl-size-lg
    const minSize = 0.6;   // em – untere Grenze
    const step    = 0.05;  // Schrittgröße

    let size = maxSize;
    el.style.fontSize = size + 'em';

    while (overflows() && size > minSize) {
      size -= step;
      el.style.fontSize = size + 'em';
    }
  });
});