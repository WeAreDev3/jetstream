window.addEventListener('DOMContentLoaded', function() {
    for (var i = 0, l = domFunctions.length; i < l; i++) {
        domFunctions[i]();
    }

    if (inApp) {
        window.socket = io();
        socket.emit('ready');
        socket.emit('getUsersFriends');
        socket.on('getUsersFriends', function(friends) {
            console.log(friends);
            new FriendList(friends);
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
    }

});
