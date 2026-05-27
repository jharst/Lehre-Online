function applyGridTransforms(scope = document) {
  scope.querySelectorAll('grid').forEach(grid => {
    const contentWidth = grid.offsetWidth;
    if (!contentWidth) return;

    const rotateValue = -78;
    const translateX = -10 + (contentWidth * 0.001);
    const translateY = 60;

    grid.style.transform = `rotate(${rotateValue}deg) translate(${translateX}%, ${translateY}%)`;
  });
}

function init() {
  // initial
  applyGridTransforms(document);

  // Reveal.js Events (Slides Extended basiert i.d.R. darauf)
  if (window.Reveal) {
    Reveal.on('ready', (e) => applyGridTransforms(e.currentSlide || document));
    Reveal.on('slidechanged', (e) => applyGridTransforms(e.currentSlide || document));
    Reveal.on('resize', () => applyGridTransforms(document));
  }
}

window.addEventListener('load', init);