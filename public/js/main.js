function signinCallback(authResult) {
    console.log(authResult);
    if (authResult.code) {
        console.log('Succeeded!');
        var request = new XMLHttpRequest();
        request.open('POST', '/auth/google/callback', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify({
            id_token: authResult.id_token
        }));
    } else if (authResult.error) {
        console.log('There was an error: ' + authResult.error);
    }
};

window.addEventListener('DOMContentLoaded', function () {
    initChats();
    var headers = document.getElementsByClassName('chat-mini'),
        l = headers.length;
    for (var i = 0; i < l; i++) {
        headers[i].onclick = toggleChat;
    };

    var inputs = document.getElementsByTagName('input');
    l = inputs.length;
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onkeypress = function (e) {
            if (e.keyCode === 13) respond.bind(this)();
        }
    };

    var buttons = document.getElementsByTagName('button');
    l = buttons.length;
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = respond;
    };
});
function parseDate (date) {
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return Months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function parseTime (date) {
    var ampm = "AM";
    var hour = date.getHours();
    var minutes = date.getMinutes();

    if (hour > 11) {
        ampm = "PM";
        if (hour > 12) {
            hour = hour - 12;
        };
    };

    if (minutes < 10) {
        minutes = "0" + minutes;
    };

    return hour + ":" + minutes + " " + ampm;
}