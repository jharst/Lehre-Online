document.addEventListener('ready', () => {
  document.querySelectorAll('section[data-url], section[data-img-id], section[data-background-image]').forEach(slide => {
    
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
    if (sourceEl) {
      sourceEl.href = slide.dataset.srcHref || slide.dataset.url;
      sourceEl.title = slide.dataset.srcTitle || 'Abbildung aus dem Netz';
      // Ersten reinen Textknoten finden
      const textNode = [...sourceEl.childNodes].find(n => n.nodeType === 3);
      if (textNode) textNode.textContent = slide.dataset.srcLabel || 'Quelle';
    };
  });
});