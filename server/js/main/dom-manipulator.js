function initChats () {
    var content = document.getElementById('content').getElementsByTagName('tbody')[0],
        frag = document.createDocumentFragment();
    for (var i = 0, l = chats.length; i < l; i++) {
        addChat(frag, chats[i]);
    };
    content.appendChild(frag);
}

function addChat (parent, chatObj) {
    var header = document.createElement('tr'), // The one-line chat data
        chatName = document.createElement('td'), // The name of the chat
        latestMsg = document.createElement('td'), // The latest chat message
        wrapper1 = document.createElement('div'), // Overflow fix for latestMsg part 1
        wrapper2 = document.createElement('div'), // Overflow fix for latestMsg part 2
        date = document.createElement('td'), // The date of the latest chat message
        chat = document.createElement('tr'), // The whole chat itself
        innerWrapper = document.createElement('td'),
        inputContainer = document.createElement('div'), // The message sending container
        input = document.createElement('input'),
        button = document.createElement('button'); // The button to send a message
    
    header.classList.add('chat-mini');
    chat.classList.add('chat');
    chatName.classList.add('chat-name');
    wrapper1.classList.add('outer-wrapper');
    wrapper2.classList.add('inner-wrapper');
    latestMsg.classList.add('latest-message');
    date.classList.add('date');
    inputContainer.classList.add('input');
    input.type = 'text';
    innerWrapper.colSpan = '3';

    chatName.textContent = chatObj['name'] ? chatObj['name'] : chatObj['people'].toString();

    header.appendChild(chatName);
    header.appendChild(latestMsg);
    latestMsg.appendChild(wrapper1);
    wrapper1.appendChild(wrapper2);
    header.appendChild(date);
    chat.appendChild(innerWrapper);
    innerWrapper.appendChild(inputContainer);
    inputContainer.appendChild(input);
    inputContainer.appendChild(button);

    var j, m;
    for (j = 0, m = chatObj['messages'].length; j < m; j++) {
        addMessage(innerWrapper, chatObj['messages'][j]);
    };

    j--;

    date.textContent = parseDate(chatObj['messages'][j]['date']);
    wrapper2.textContent = chatObj['messages'][j]['content'];
    button.textContent = 'Send';

    parent.appendChild(header);
    parent.appendChild(chat);
}

function addMessage (parent, msg) {
    var msgContainer = document.createElement('div'), // The message's container
        profilePic = document.createElement('div'), // The user's profile pic
        data = document.createElement('div'), // Message details
        msgUser = document.createElement('div'), // The user's name
        msgDate = document.createElement('div'), // The date the message was sent
        msgTime = document.createElement('div'), // The time the message was sent
        msgContent = document.createElement('div'); // The message's content

    msgContainer.classList.add(msg['user'] === user['name'] ? 'right' : 'left');
    profilePic.classList.add('profile-pic');
    data.classList.add('content');
    msgUser.classList.add('user');
    msgDate.classList.add('date');
    msgTime.classList.add('time');
    msgContent.classList.add('message');

    profilePic.textContent = '\ue069';
    msgUser.textContent = msg['user'] === user['name'] ? 'You' : msg['user'];
    msgDate.textContent = parseDate(msg['date']);
    msgTime.textContent = parseTime(msg['date']);
    msgContent.textContent = msg['content'];

    data.appendChild(msgUser);
    data.appendChild(msgDate);
    data.appendChild(msgTime);
    data.appendChild(msgContent);
    msgContainer.appendChild(profilePic);
    msgContainer.appendChild(data);
    parent.appendChild(msgContainer);
}

function toggleChat () {
    if (openChat && !(this == openChat)) {
        openChat.classList.remove('expanded');
        openChat.nextElementSibling.classList.remove('expanded');
    };
    this.classList.toggle('expanded');
    this.nextElementSibling.classList.toggle('expanded');
    openChat = this;
}

function respond () {
    if ((this.value ? this.value : this.previousElementSibling.value) === '') {
        
    };
    addMessage(this.parentElement.parentElement, {
        'user': 'Tal Ben-Ari',
        'date': new Date(),
        'content': this.value ? this.value : this.previousElementSibling.value
    });
    this.value ? this.value = '' : this.previousElementSibling.value = '';
}