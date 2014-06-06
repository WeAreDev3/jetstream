window.addEventListener('DOMContentLoaded', function() {
    for (var i = 0, l = domFunctions.length; i < l; i++) {
        domFunctions[i]();
    }

    if (inApp) {
        var socket = io();
        socket.emit('ready');
    }

});
