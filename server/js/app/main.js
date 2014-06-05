window.addEventListener('mousedown', function (e) {
    var el = e.target, chat = el, i;

    // Handling the window dragging (from the header)
    if (el.parentElement && el.parentElement.window) window.currentWin = el.parentElement.window;
    if (el.tagName === 'HEADER' && currentWin) {
        currentWin.mouseX = e.clientX;
        currentWin.mouseY = e.clientY;
        
        window.addEventListener('mousemove', currentWin.drag);
    }

    // Defining the chat box, if one was clicked
    while (!chat.classList.contains('chat')) {
        chat = chat.parentElement;
        if (chat === null) break;
    }

    // Handling chat box stuffs
    if (chat !== null) {
        chat.style.zIndex = app.chats.length + 1;
        chat.style.position = 'fixed';
        for (i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.style.zIndex = Math.max(app.chats[i].el.style.zIndex - 1, 1);
            app.chats[i].el.classList.remove('active');
        }
        chat.classList.add('active');
        setTimeout(function(){chat.getElementsByTagName('input')[0].focus();}, 0);
    } else {
        for (i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.classList.remove('active');
        }
    }
});

window.addEventListener('mouseup', function (e) {
    if (window.currentWin !== undefined) {
        window.removeEventListener('mousemove', currentWin.drag);
    }
});
