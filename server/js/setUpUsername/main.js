var socket = io(),
    check = document.getElementById('usernameCheck'),
    usernameInput = document.getElementById('usernameInput'),
    userRegEx = /^[a-zA-Z0-9]{3,}$/;

document.getElementById('usernameInput').onkeyup = function(event) {
    var username = event.target.value;

    if (username.trim() !== '') {
        if (userRegEx.test(username)) {
            socket.emit('isUsernameTaken', username);
        } else {
            check.classList.remove('ok', 'err');
            check.classList.add('err');
            check.title = 'Username not available';
        }
        
    } else {
        check.classList.remove('ok', 'err');
        check.title = 'No username';
    }
};

socket.on('isUsernameTaken', function(username, taken) {
    console.log(arguments);
    if (taken) {
        check.classList.remove('ok', 'err');
        check.classList.add('err');
        check.title = 'Username not available';
    } else {
        check.classList.remove('ok', 'err');
        check.classList.add('ok');
        check.title = 'Username available';
    }
});

document.getElementById('usernameSubmit').onclick = function(event) {
    console.log('Username valid:', '"' + usernameInput.value + '"');
    socket.emit('setUsernamefromId', usernameInput.value);
};

socket.on('setUsernamefromId', function(ok) {
    console.log(ok);

    if (!ok) {
        check.classList.remove('ok', 'err');
        check.classList.add('err');
        check.title = 'Username not available';
    } else {
        window.location.reload();
    }
});