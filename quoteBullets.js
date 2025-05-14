document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('ul').forEach(ul => {
        //Bearbeite alle ul-Elemente, die ["] beinhalten, füge ihnen die Klassen 'fa-ul' und 'embedded-quote-block' hinzu
        //und lösche alle Tags (aber nicht style-Anweisungen wie 'color: #772F8B75')
        
        if (ul.innerHTML.includes('["]')) {
            ul.classList.add('fa-ul');
            ul.classList.add('embedded-quote-block');
            ul.querySelectorAll('li').forEach(li => {
                li.innerHTML = li.innerHTML.replace(/\[\"\]/g, '<i class="fa-li fa fa-quote-right" style="color: #772F8B75; font-size: smaller;"></i>');
                li.innerHTML = li.innerHTML.replace(/(?<!")(#[a-zA-Z_]+\b)(?!")/g, '');
            });
        };
    });
});
