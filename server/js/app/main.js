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
socket.on('getIdFromUsername', function(data) {
    if (data.id) {
        socket.emit('getOtherUserInfo', data.id);
    }
});
socket.on('getOtherUserInfo', function(data) {
    console.log(data);
    var searchBar = document.getElementById('friendList').getElementsByClassName('searchBar')[0];
    searchBar.classList.remove('spin');
    searchBar.getElementsByTagName('h3')[0].classList.remove('icon-cog');
    
    new Friend(data.googName, data.username, data.googImgUrl, data.id);
});
socket.on('sendFriendRequest', function(err, response, updated) {
    console.log(err, response, updated);
});