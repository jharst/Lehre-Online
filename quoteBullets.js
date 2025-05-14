document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('ul.embedded-quote-block').forEach(ul => {
        ul.classList.add('fa-ul');
        ul.querySelectorAll('li').forEach(li => {
            li.innerHTML = li.innerHTML.replace(/\[\"\]/g, '<i class="fa-li fa fa-quote-right" style="color: #772F8B75; font-size: smaller;"></i>');
        });
    });
});
