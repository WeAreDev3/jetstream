var domFunctions = domFunctions || [];
domFunctions.push(initSearch);
// domFunctions.push(initChats);
// domFunctions.push(initMessages);

var app = {
    chats: [],
    messages: [],
    windows: []
};

function initChats () {
    var frag = document.createDocumentFragment();
    for (var i = chats.length - 1; i >= 0; i--) {
        new Chat(chats[i], frag);
    }

    document.body.appendChild(frag);
}

function initMessages () {
    for (var i = 0; i < messages.length; i++) {
        new Message(messages[i]);
    }
}

function initSearch(argument) {
    var searchContect = document.getElementsByClassName('sidebar')[0].getElementsByClassName('searchContent')[0].getElementsByTagName('ul')[0],
        searchInput = document.getElementById('search');

    searchInput.onkeyup = function(event) {
        var element = event.target,
            input = element.value.trim();

        if (element.dataset.prevValue !== input || event.keyCode === 13) {
            if (input !== '') {
                socket.emit('getIdFromUsername', input);
            } else {
                searchContect.setAttribute('hidden', '');

                while (searchContect.firstChild) {
                    searchContect.removeChild(searchContect.firstChild);
                }
            }
        }
        element.dataset.prevValue = input;
    };
}