var domFunctions = domFunctions || [];
domFunctions.push(initChats);
domFunctions.push(initMessages);

var app = {
    chats: [],
    messages: []
};

function initChats () {
    var frag = document.createDocumentFragment();
    for (var i = chats.length - 1; i >= 0; i--) {
        app.chats.push(new Chat(chats[i], frag));
    }

    document.body.appendChild(frag);
}

function initMessages () {
    for (var i = 0; i < messages.length; i++) {
        app.messages.push(new Message(messages[i]));
    }
}