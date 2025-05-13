document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('div.embedded-quote-block').forEach(div => {
        div.querySelectorALl('li').forEach(li => {
            li.innerHTML = div.innerHTML.replace(/(?<!["'])#\w+/g, '<span class="hidden-tag">$&</span>');
    });
});