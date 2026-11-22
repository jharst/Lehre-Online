// Skaliert Titel so, dass der Text in seine Box passt.
// Läuft nach Reveal-Initialisierung und nach dem Laden der Webfonts,
// damit alle Slides gerendert sind und Oswald schon verfügbar ist.
//
// Zwei Messverfahren, je nach Aufbau des Titels:
//   1. fitBoxText          – Standard: Überlauf über scrollWidth/scrollHeight.
//                            Gilt für .right-title-text, .slide-title-left--title,
//                            .diagram-title und .quote-bg-title (unverändert
//                            gegenüber der ursprünglichen Fassung).
//   2. fitRotatedStripTitle – nur .vl-text-photo-title: dort ist das p selbst
//                            um ~89° gedreht, sodass scrollWidth/rect die
//                            Boxbreite bzw. eine gedrehte Kante liefern statt
//                            der Textlänge. Gemessen wird deshalb offsetWidth
//                            gegen offsetHeight des Containers.

const TITLE_MAX_SIZE = 1.4;   // em, Ausgangsgröße
const TITLE_MIN_SIZE = 0.6;   // em, Untergrenze
const TITLE_STEP     = 0.05;  // em, Schrittweite

// Untertitel der Titelfolie startet kleiner als der Obertitel.
// Verhältnis entspricht dem CSS (.slide-title-left--subtitle: 0.8em).
const SUBTITLE_MAX_SIZE = TITLE_MAX_SIZE * 0.8;   // em
const SUBTITLE_MIN_SIZE = TITLE_MIN_SIZE * 0.8;   // em

// Standardfall: Text läuft waagerecht (oder per writing-mode senkrecht) in
// einer Box mit fester Breite/Höhe. Überlauf heißt: scrollWidth bzw.
// scrollHeight ist größer als die Innenbreite/-höhe.
// maxSize/minSize sind optional; ohne Angabe gelten die Titel-Werte.
function fitBoxText(el, maxSize = TITLE_MAX_SIZE, minSize = TITLE_MIN_SIZE) {
  const isVertical = getComputedStyle(el).writingMode.includes('vertical');
  const overflows = () => isVertical
    ? el.scrollHeight > el.clientHeight
    : el.scrollWidth > el.clientWidth;

  // Zurücksetzen, damit ein erneuter Lauf (slidechanged) nicht auf dem
  // bereits verkleinerten Inline-Wert aufsetzt.
  el.style.fontSize = '';

  let size = maxSize;
  el.style.fontSize = size + 'em';

  while (overflows() && size > minSize) {
    size -= TITLE_STEP;
    el.style.fontSize = size + 'em';
  }
}

// Sonderfall .vl-text-photo-title: Der Titel steht im rechten Farbstreifen,
// das p ist gedreht. Gemessen wird offsetWidth (ungedrehte Textlänge, weil
// die Box width: max-content hat) gegen offsetHeight des Containers.
//
// Wenn der Titel optisch über den Rand läuft, obwohl er rechnerisch passt,
// sind das die Ansatzpunkte – in dieser Reihenfolge prüfen:
//   1. limit (hier, Faktor 0.92): wie viel der Containenhöhe der Titel
//      belegen darf. Kleiner = früher verkleinern (z. B. 0.85).
//   2. line-height in .vl-text-photo-title (vl-slides.css, 1.1): bestimmt
//      die Dicke der Zeile quer zur Laufrichtung, also ob der Titel seitlich
//      im 7-%-Streifen sitzt und nicht oben/unten anschlägt.
//   3. bottom in .vl-text-photo-title (4 %): Startpunkt der gedrehten Box.
//      Er verschiebt den ganzen Titel, nicht seine Länge – bei Überlauf
//      oben ist bottom zu klein, bei Abstand oben zu groß.
// Die Schriftgröße selbst ist nur die Folge dieser drei Werte; sie hier oder
// im CSS hochzudrehen, ohne 1–3 zu prüfen, verschiebt das Problem nur.
function fitRotatedStripTitle(el) {
  // Wichtig: alle Maße in derselben Einheit. offsetWidth/offsetHeight sind
  // Layout-Pixel (ungedreht, ohne Reveal-Skalierung), getBoundingClientRect()
  // liefert dagegen Bildschirm-Pixel nach der Skalierung (width/height im
  // Frontmatter auf die Fenstergröße). Beides zu mischen verschiebt die
  // Grenze je nach Fenstergröße und macht die Skalierung unberechenbar.
  // Deshalb durchgehend offset-Maße.
  const box = el.parentElement || el;
  const limit = (box.offsetHeight || window.innerHeight) * 0.92;

  // Start bei der im CSS gesetzten Größe (font-size: larger, wie
  // .right-title-text), Untergrenze 60 % davon. Beide Titel-Typen müssen
  // von derselben Ausgangsgröße ausgehen, sonst skaliert der Streifentitel
  // sichtbar kleiner als der Standardtitel bei gleich viel Platz.
  el.style.fontSize = '';
  const base = parseFloat(getComputedStyle(el).fontSize) || 16;
  const floor = base * 0.6;

  // offsetWidth ist bei width: max-content die ungedrehte Textlänge; die
  // Rotation verändert Layout-Maße nicht.
  let size = base;
  while (el.offsetWidth > limit && size > floor) {
    size -= 1;                       // 1 px pro Schritt, feiner als 0.05em
    el.style.fontSize = size + 'px';
  }
}

function fitTitleText(el) {
  if (el.classList.contains('vl-text-photo-title')) {
    fitRotatedStripTitle(el);
  } else if (el.classList.contains('slide-title-left--subtitle')) {
    // Untertitel bleibt proportional kleiner als der Obertitel
    fitBoxText(el, SUBTITLE_MAX_SIZE, SUBTITLE_MIN_SIZE);
  } else {
    fitBoxText(el);
  }
}

function fitAll(root) {
  (root || document).querySelectorAll(
    '.right-title-text, .slide-title-left--title, .slide-title-left--subtitle, .quote-bg-title, .diagram-title, .vl-text-photo-title'
  ).forEach(fitTitleText);
}

Reveal.on('ready', ({ currentSlide }) => {
  fitAll(currentSlide);
  // Webfont Oswald kommt oft erst nach 'ready'; danach neu messen,
  // sonst wird gegen die breitere Fallback-Schrift skaliert.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => fitAll(currentSlide));
  }
});

Reveal.on('slidechanged', ({ currentSlide }) => {
  fitAll(currentSlide);
});
