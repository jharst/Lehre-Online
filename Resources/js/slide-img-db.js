document.addEventListener('DOMContentLoaded', () => {

  // Bilddatenbank laden
  const paths = [
    './slide-images.json',                        // GitHub Pages: JS und JSON im selben Ordner
    './Resources/js/slide-images.json',           // Obsidian: relativ zum Vault-Root
    '../Resources/js/slide-images.json'           // zur Sicherheit
  ];

  async function loadDb() {
    // Obsidian-Kontext: app API verwenden
    if (typeof app !== 'undefined' && app.vault) {
      const file = await app.vault.adapter.read('Resources/js/slide-images.json');
      return JSON.parse(file);
    }
    
    // GitHub Pages / localhost: fetch verwenden
    const paths = [
      './Resources/js/slide-images.json',
      '../Resources/js/slide-images.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`404: ${path}`);
        console.log('Geladen von:', path);
        return await response.json();
      } catch (e) {
        console.log('Nicht gefunden:', path, e.message);
      }
    }
    
    throw new Error('Bilddatenbank nicht gefunden');
  }
    
  loadDb()
    .then(response => {
      console.log('Geladen:', response.url); // ← neu
      return response.json();
    })  
    .then(db => {
      console.log('Slides gefunden:', document.querySelectorAll('section[data-url], section[data-img-id]').length);
      document.querySelectorAll('section[data-url], section[data-img-id], section[data-background-image]').forEach(slide => {
        console.log('data-img-id:', slide.dataset.imgId);
        console.log('data-url:', slide.dataset.url);
        console.log('--slide-img:', slide.style.getPropertyValue('--slide-img'));

        // 1. Basis: Eintrag aus JSON (falls data-img-id gesetzt)
        const imgId = slide.dataset.imgId;
        const base = imgId && db[imgId] ? db[imgId] : {};
        console.log('imgId:', imgId);
        console.log('base:', base);

        // 2. data-src-* aus dem Slide zusammensammeln
        const overrides = {};
        Object.entries(slide.dataset).forEach(([key, value]) => {
          // camelCase → kebab-case: srcHref → src-href
          const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          overrides[kebab] = value;
        });

        // 3. Merge: JSON-Defaults, überschrieben durch data-src-*
        const merged = { ...base, ...overrides };
        console.log('merged:', merged);
        // 4. Bild-URL setzen
        const url = merged['url'];
        if (url) {
          slide.style.setProperty('--slide-img', `url(${url})`);
        }

        // Bild-URL setzen: <img> oder background-image
        const imgEl = slide.querySelector('.img-wrapper img');
        if (imgEl) {
          // Template mit <img>-Tag
          if (url) imgEl.setAttribute('src', url);
          const caption = slide.querySelector('.img-wrapper figcaption');
          if (caption && merged['src-title']) caption.textContent = merged['src-title'];
        } else {
          // Template mit Hintergrundbild
          if (url) {
            slide.style.setProperty('--slide-img', `url(${url})`);
            if (!slide.dataset.backgroundImage) {
              slide.setAttribute('data-background-image', url);
              Reveal.sync();
            }
          }
        }
        // 5. Bekannte src-* Properties als CSS-Variablen setzen
        const srcProps = {
          'src-size':     '--slide-img-size',
          'src-position': '--slide-img-position',
        };
        Object.entries(srcProps).forEach(([key, cssVar]) => {
          if (merged[key]) slide.style.setProperty(cssVar, merged[key]);
        });

        // 6. Quellenangabe befüllen
        const sourceEl = slide.querySelector('.right-image-source a');
        if (sourceEl) {
          if (merged['src-href'])  sourceEl.href  = merged['src-href'];
          if (merged['src-title']) sourceEl.title = merged['src-title'];
          if (merged['src-label']) sourceEl.childNodes[0].textContent = merged['src-label'];
        }

        // 7. data-css-* automatisch als CSS-Properties setzen
        Object.entries(slide.dataset).forEach(([key, value]) => {
          console.log('dataset key:', key, '→ starts with css?', key.startsWith('css'));
          if (key.startsWith('css')) {
            const property = key
              .slice(3)
              .replace(/([A-Z])/g, '-$1')
              .toLowerCase()
              .replace(/^-/, '');
            console.log('Property:', property, 'Value:', value);
            slide.style.setProperty('--css-' + property, value);
          }
        });

      });
    })
    .catch(err => console.error('Bilddatenbank konnte nicht geladen werden:', err));

});