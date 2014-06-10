var inApp = true;

window.addEventListener('mousedown', function(e) {
    var el = e.target,
        win = el,
        i;

    // Defining the window, if one was clicked
    while (!win.classList.contains('chat') && win !== null) {
        win = win.parentElement;
    }

    // Handling window stuffs
    if (win !== null) {
        window.currentWin = win.window;

        // Handling the window dragging (from the header)
        if (el.tagName === 'HEADER') {
            currentWin.mouseX = e.clientX;
            currentWin.mouseY = e.clientY;

            window.addEventListener('mousemove', currentWin.drag);
        }

        win.style.zIndex = app.chats.length + 1;
        win.style.position = 'fixed';
        for (i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.style.zIndex = Math.max(app.chats[i].el.style.zIndex - 1, 1);
            app.chats[i].el.classList.remove('active');
        }
        win.classList.add('active');

    } else {
        for (i = app.chats.length - 1; i >= 0; i--) {
            app.chats[i].el.classList.remove('active');
        }
    }
});

window.addEventListener('mouseup', function(e) {
    var selectable = document.getElementsByClassName('message-text');

    for (var i = selectable.length - 1; i >= 0; i--) {
        selectable[i].classList.add('selectable');
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
