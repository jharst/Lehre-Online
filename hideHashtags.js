document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('div').forEach(div => {
        div.innerHTML = div.innerHTML.replace(/#(\w+)/g, '<span class="hidden-tag">#$1</span>');
    });
});