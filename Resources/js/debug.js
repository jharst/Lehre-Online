document.addEventListener('ready', () => {
  console.log('Event gefeuert');
  
  const slides = document.querySelectorAll('.slide[data-url]');
  console.log('Slides mit data-url gefunden:', slides.length);
  
  slides.forEach(slide => {
    const url = slide.getAttribute('data-url');
    console.log('URL:', url);
    slide.style.setProperty('--slide-img', `url('${url}')`);
    console.log('CSS-Variable gesetzt:', slide.style.getPropertyValue('--slide-img'));
  });
});