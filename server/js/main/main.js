window.addEventListener('DOMContentLoaded', function() {
    for (var i = 0, l = domFunctions.length; i < l; i++) {
        domFunctions[i]();
    }
});

var socket = io();
