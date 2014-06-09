var socket = io(),
    check = document.getElementById('usernameCheck'),
    usernameInput = document.getElementById('usernameInput'),
    usernameSubmit = document.getElementById('usernameSubmit');

usernameInput.onkeyup = function(event) {
    var username = event.target.value;

    check.classList.remove('ok', 'err');

    if (username.trim() !== '') {
        if (validator.isAlphanumeric(username)) {
            if (validator.isLength(username, 3)) {
                if (event.keyCode === 13) {
                    socket.emit('setUsernamefromId', username);
                } else {    
                    socket.emit('isUsernameTaken', username);
                }
            } else {
                check.classList.add('err');
                check.title = 'Username has to be at least 3 characters long';
            }
        } else {
            check.classList.add('err');
            check.title = 'Username can only contain letters and numbers';
        }
    } else {
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

usernameSubmit.onclick = function(event) {
    socket.emit('setUsernamefromId', usernameInput.value);
};

socket.on('setUsernamefromId', function(ok) {
    if (!ok) {
        check.classList.remove('ok', 'err');
        check.classList.add('err');
        check.title = 'Username not available';
    } else {
        window.location.reload();
    }
});