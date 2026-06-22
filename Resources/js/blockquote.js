document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('ul').forEach(ul => {
        //Bearbeite alle ul-Elemente, die ["] beinhalten, füge ihnen die Klassen 'fa-ul' und 'embedded-quote-block' hinzu
        //und lösche alle Tags (aber nicht style-Anweisungen wie 'color: #772F8B75')
        
        if (ul.innerHTML.includes('["]')) {
            // ul.classList.add('fa-ul');
            ul.classList.add('embedded-quote-block');

            // ul.querySelectorAll('li').forEach(li => {
            //     li.innerHTML = li.innerHTML.replace(/\[\"\]/g, '<span class="fa-li"><i class="fa-solid fa-quote-right" style="color: #772F8B"></i></span>');
            //     li.innerHTML = li.innerHTML.replace(/(?<!")(#[a-zA-Z_]+\b)(?!")/g, '');
            // });
            ul.querySelectorAll('li').forEach(li => {
                li.innerHTML = li.innerHTML.replace(
                    /\[\"\]/g,
                    '<i class="fa-solid fa-quote-right float-icon"></i>'
                );
                li.innerHTML = li.innerHTML.replace(/(?<!")(#[a-zA-Z_]+\b)(?!")/g, '');
            });
        };
    });

    // Fragments: alle Zitat-li einer Slide mit Klasse 'auto-fragments'
    document.querySelectorAll('section.auto-fragments .embedded-quote-block li').forEach((li, index) => {
        li.classList.add('fragment', 'fade-in');
        li.setAttribute('data-fragment-index', index);
    });
});