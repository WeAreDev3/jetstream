window.addEventListener('mousedown', function(e) {
    var el = e.target,
        win = el,
        i;

    // Defining the window, if one was clicked
    while (!win.classList.contains('window')) {
        win = win.parentElement;
        if (win === null) break;
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

        win.style.zIndex = app.windows.length + 1;
        win.style.position = 'fixed';
        for (i = app.windows.length - 1; i >= 0; i--) {
            app.windows[i].el.style.zIndex = Math.max(app.windows[i].el.style.zIndex - 1, 1);
            app.windows[i].el.classList.remove('active');
        }
        win.classList.add('active');

    } else {
        for (i = app.windows.length - 1; i >= 0; i--) {
            app.windows[i].el.classList.remove('active');
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


window.socket = io();
socket.emit('ready');
// socket.emit('getUsersFriends');
socket.emit('getUsersFriendRequests');

socket.on('getUsersFriends', function(friends) {
    console.log(friends);
    new FriendList(friends);
});
socket.on('getUsersFriendRequests', function(scope, err, requests) {
    var numRequests = requests.length,
        chatInfo,
        friendsList,
        notification,
        icon,
        number,
        text1,
        text2;

    if (numRequests) {
        chatInfo = document.getElementsByClassName('sidebar')[0].getElementsByClassName('chatInfo')[0];
        friendsList = document.getElementsByClassName('sidebar')[0].getElementsByClassName('friendsList')[0];

        notification = document.createElement('div');
        icon = document.createElement('span');
        number = document.createElement('b');
        text1 = document.createTextNode('You have ');
        text2 = document.createTextNode(' friend request' + (numRequests !== 1 ? 's' : ''));

        notification.classList.add('friendRequests');
        icon.classList.add('icon-users');
        number.textContent = numRequests;

        notification.appendChild(icon);
        notification.appendChild(text1);
        notification.appendChild(number);
        notification.appendChild(text2);

        chatInfo.insertBefore(notification, friendsList);
    }
});
socket.on('getIdFromUsername', function(username, err, userId) {
    var searchContent = document.getElementsByClassName('sidebar')[0].getElementsByClassName('searchContent')[0],
        ul;

    if (userId) {
        searchContent.removeAttribute('hidden');
        socket.emit('getOtherUserInfo', userId);
    } else {
        ul = searchContent.getElementsByTagName('ul')[0];

        searchContent.setAttribute('hidden', '');

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
});
socket.on('getOtherUserInfo', function(userId, err, user) {
    if (user) {
        console.log(user);
        var searchContent = document.getElementsByClassName('sidebar')[0].getElementsByClassName('searchContent')[0].getElementsByTagName('ul')[0];

        while (searchContent.firstChild) {
            searchContent.removeChild(searchContent.firstChild);
        }

        searchContent.appendChild(new SidebarItem(userId, user.googImgUrl, user.googName, user.username, function(event) {
            var element = event.target;

            if (element.tagName !== 'LI') {
                element = element.parentElement;
            }

            socket.emit('sendFriendRequest', element.dataset.id);
        }));
    }
});
socket.on('sendFriendRequest', function(toId, err, updated, response) {
    console.log(err, updated, response);
});