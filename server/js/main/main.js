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