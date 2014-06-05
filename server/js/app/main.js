window.addEventListener('mousedown', function (e) {
    var el = e.target, chat = el;
    if (el.parentElement.window) window.currentWin = el.parentElement.window;
    if (el.tagName === 'HEADER' && currentWin) {
        currentWin.mouseX = e.clientX;
        currentWin.mouseY = e.clientY;
        
        window.addEventListener('mousemove', currentWin.drag);
    }
    while (!chat.classList.contains('chat')) {
        if (chat === window) break;
        chat = chat.parentElement;
    }
    if (chat != window) {
        chat.style.zIndex = app.chats.length;
        for (var i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.style.zIndex--;
            app.chats[i].el.classList.remove('active');
        }
        chat.classList.add('active');
    }
});

window.addEventListener('mouseup', function (e) {
    window.removeEventListener('mousemove', currentWin.drag);
});
