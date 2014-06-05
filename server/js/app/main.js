window.addEventListener('mousedown', function (e) {
    var el = e.target;
    window.currentWin = el.parentElement.window;
    if (el.tagName === 'HEADER' && currentWin) {
        currentWin.mouseX = e.clientX;
        currentWin.mouseY = e.clientY;
        el.parentElement.style.zIndex = app.chats.length;
        for (var i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.style.zIndex--;
        }
        window.addEventListener('mousemove', currentWin.drag);
    }
});

window.addEventListener('mouseup', function (e) {
    window.removeEventListener('mousemove', currentWin.drag);
});
