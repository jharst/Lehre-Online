document.addEventListener('ready', () => {
  document.querySelectorAll('section[data-url]').forEach(slide => {
    
    // Bild
    const url = slide.dataset.url;
    slide.style.setProperty('--slide-img', `url('${url}')`);

    // Background-size (Fallback: cover)
    const size = slide.dataset.srcSize || 'cover';
    slide.style.setProperty('--slide-img-size', size);

    // Background-position (Fallback: center)
    const position = slide.dataset.srcPosition || 'center';
    slide.style.setProperty('--slide-img-position', position);

    // Background-repeat (Fallback: no-repeat)
    const repeat = slide.dataset.srcRepeat || 'no-repeat';
    slide.style.setProperty('--slide-img-repeat', repeat);;

    // Quellenangabe
    const sourceEl = slide.querySelector('.right-image-source a');
    if (sourceEl && slide.dataset.srcHref) {
      sourceEl.href = slide.dataset.srcHref;
      sourceEl.title = slide.dataset.srcTitle || '';
      sourceEl.childNodes[0].textContent = slide.dataset.srcLabel || '';
    }
  });
});