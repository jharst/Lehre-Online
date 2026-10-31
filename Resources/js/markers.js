// Marker in Slides umsetzen:
//   ["]  -> Icon als Inline-Bild im Textfluss (Zitat, float-icon)
//   [>]  -> Icon ersetzt den Bullet der <li> (Font Awesome fa-li)
//
// Wichtig: Es wird nur an <li> gearbeitet, die den Marker selbst enthalten.
// Alle anderen <li> behalten ihren normalen Bullet und ihr Standard-Layout.
const MARKERS = {
    '["]': { mode: 'inline', icon: 'fa-quote-right' },
    '[>]': { mode: 'bullet', icon: 'fa-angle-right fa-xs' },
    '[!]': { mode: 'bullet', icon: 'fa-exclamation fa-xs' }
};

const TAG_RE = /(?<!")(#[\p{L}\p{M}\p{N}_]+\b)(?!")/gu;

function textNodesOf(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
}

// Marker nur im Text der <li> suchen (nicht in verschachtelten <ul>)
function markerNode(li, key) {
    return textNodesOf(li).find(n => n.nodeValue.includes(key)) || null;
}

function replaceList(ul) {
    const key = Object.keys(MARKERS).find(m => ul.textContent.includes(m));
    if (!key) return;
    const { mode, icon } = MARKERS[key];

    const items = ul.querySelectorAll('li');
    let touched = false;

    items.forEach(li => {
        const node = markerNode(li, key);
        if (!node) return;
        touched = true;

        const text = node.nodeValue.replace(key, '').replace(TAG_RE, '');

        if (mode === 'inline') {
            const span = document.createElement('span');
            span.innerHTML = `<i class="fa-solid ${icon} float-icon"></i>${text}`;
            node.replaceWith(...span.childNodes);
        } else {
            node.nodeValue = text.replace(/^\s+/, '');
            const bullet = document.createElement('span');
            bullet.className = 'fa-li';
            bullet.innerHTML = `<i class="fa-solid ${icon}"></i>`;
            li.prepend(bullet);
            li.classList.add('marker-bullet');
        }
    });

    if (!touched) return;

    if (mode === 'bullet') ul.classList.add('marker-bullet-block');
    else ul.classList.add('embedded-quote-block');
}

function run() {
    document.querySelectorAll('.reveal .slides ul').forEach(replaceList);
    document.querySelectorAll('section.auto-fragments .embedded-quote-block li')
        .forEach((li, i) => {
            li.classList.add('fragment', 'fade-in');
            li.setAttribute('data-fragment-index', i);
        });
}

// Slides Extended rendert die Slides erst nach Reveal.initialize()
if (window.Reveal && Reveal.isReady && Reveal.isReady()) run();
else if (window.Reveal) Reveal.on('ready', run);
else document.addEventListener('DOMContentLoaded', run);
