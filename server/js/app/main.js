var inApp = true;

window.addEventListener('mousedown', function(e) {
    var el = e.target,
        chat = el,
        i;

    // Defining the chat box, if one was clicked
    while (!chat.classList.contains('chat')) {
        chat = chat.parentElement;
        if (chat === null) break;
    }

    // Handling chat box stuffs
    if (chat !== null) {
        window.currentWin = chat.window;

        // Handling the window dragging (from the header)
        if (el.tagName === 'HEADER') {
            currentWin.mouseX = e.clientX;
            currentWin.mouseY = e.clientY;

            window.addEventListener('mousemove', currentWin.drag);
        }

        chat.style.zIndex = app.chats.length + 1;
        chat.style.position = 'fixed';
        for (i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.style.zIndex = Math.max(app.chats[i].el.style.zIndex - 1, 1);
            app.chats[i].el.classList.remove('active');
        }
        chat.classList.add('active');

    } else {
        for (i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.classList.remove('active');
        }
    }
});

window.addEventListener('mouseup', function(e) {
    var selectableMessages = document.querySelectorAll('.message-text');

    for (var i = selectableMessages.length - 1; i >= 0; i--) {
        selectableMessages[i].classList.add('selectable');
    }

    if (window.currentWin !== undefined) {
        window.removeEventListener('mousemove', currentWin.drag);

        if (window.getSelection().isCollapsed) {
            setTimeout(function() {
                currentWin.el.getElementsByTagName('input')[0].focus();
            }, 0);
        }
    }
});
