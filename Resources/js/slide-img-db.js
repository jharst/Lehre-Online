document.addEventListener('DOMContentLoaded', () => {

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
        const data = await response.json();
        console.log('JSON geparst:', typeof data, Object.keys(data).length);
        return data;
      } catch (e) {
        console.log('Nicht gefunden:', path, e.message);
      }
    }
    
    throw new Error('Bilddatenbank nicht gefunden');
  }
    
  loadDb()
    .then(db => {
      console.log('Slides gefunden:', document.querySelectorAll('section[data-url], section[data-img-id]').length);
      document.querySelectorAll('section[data-url], section[data-img-id], section[data-background-image]').forEach(slide => {
        console.log('data-img-id:', slide.dataset.imgId);
        console.log('data-url:', slide.dataset.url);
        console.log('--slide-img:', slide.style.getPropertyValue('--slide-img'));

              // 1. Basis: Eintrag aus JSON (falls data-img-id gesetzt)
        const imgId = slide.dataset.imgId;
        const base = imgId && db[imgId] ? db[imgId] : {};
        // Warnung wenn img-id angegeben, aber nicht in der DB gefunden
        if (imgId && !db[imgId]) {
          console.warn(`slide-img-db: ID "${imgId}" nicht in der Datenbank gefunden.`);
        }
        // 2. Nur data-src-* Attribute als Overrides sammeln
        const overrides = {};
        Object.entries(slide.dataset).forEach(([key, value]) => {
          if (!key.startsWith('src')) return;
          const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          overrides[kebab] = value;
        });

        // 3. Merge: JSON-Defaults, überschrieben durch data-src-*
        const merged = { ...base, ...overrides };

        // 4. URL bestimmen
        const url = slide.dataset.url || merged['url'];

        // 5. Bild setzen
        const imgEl = slide.querySelector('.img-wrapper img');
        const rightTopDiv = slide.querySelector('.right-top-div');

        if (imgEl) {
          // Template mit <img>-Tag
          if (url) imgEl.setAttribute('src', url);
          const caption = slide.querySelector('.img-wrapper figcaption');
          if (caption && merged['src-title']) caption.textContent = merged['src-title'];

        } else if (url && rightTopDiv) {
          // Template mit .right-top-div → CSS-Variablen am section-Element setzen,
          // damit vl-slides.css sie per var(--slide-img) im .right-top-div abrufen kann.
          // Direktes backgroundImage vermeiden – CSS-Variablen umgehen Probleme
          // mit Sonderzeichen wie %20 und Klammern in der URL.
          slide.style.setProperty('--slide-img', `url("${url}")`);
          slide.style.setProperty('--slide-img-size', merged['src-size'] || 'cover');
          slide.style.setProperty('--slide-img-position', merged['src-position'] || 'center');
          console.log('--slide-img gesetzt:', slide.style.getPropertyValue('--slide-img'));
          console.log('url:', url);
          console.log('merged url:', merged['url']);
          console.log('slide.dataset.url:', slide.dataset.url);
          console.log('rightTopDiv:', rightTopDiv);
          console.log('imgEl:', imgEl);
        } else if (url && !rightTopDiv) {
          // Template ohne .right-top-div → Bild als section-Hintergrund
          slide.style.setProperty('--slide-img', `url("${url}")`);
          if (!slide.dataset.backgroundImage) {
            slide.setAttribute('data-background-image', url);
            if (merged['src-size']) slide.setAttribute('data-background-size', merged['src-size']);
            if (merged['src-position']) slide.setAttribute('data-background-position', merged['src-position']);
            Reveal.sync();
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