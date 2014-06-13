var Chat = Chat || function(data, parent) {
    console.log(data);
    this.users = [];
    for (var i = data.users.length - 1; i >= 0; i--) {
        this.users.push(users[data.users[i]].displayName);
    }

    this.name = data.name ? data.name : this.users.join(', ');
    this.id = data.id;

    this.initElement(parent);
    this.window = new Win(this.el);
    app.chats.push(this);
    app.windows.push(this);
};

Chat.prototype.initElement = function(parent) {
    parent = parent || document.body;

    var container = document.createElement('div'),
        header = document.createElement('header'),
        content = document.createElement('section'),
        response = document.createElement('footer'),
        input = document.createElement('input');

    container.id = this.id;
    container.classList.add('chat');
    container.classList.add('window');
    header.textContent = this.name;
    input.onkeypress = this.checkInput.bind(this);

    this.el = container;

    response.appendChild(input);
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(response);
    parent.appendChild(container);
};

Chat.prototype.checkInput = function(e) {
    var self = this,
        input = this.el.getElementsByTagName('input')[0],
        message;

    if (e.keyCode === 13 && input.value.trim() !== '') {
        message = new Message({
            id: Math.floor(Math.random() * 1000),
            message: input.value,
            chatId: self.id,
            userId: currentUser.id,
            timestamp: (new Date()).toISOString(),
            tempId: 99999 * Math.random()
        });
        input.value = '';
        socket.emit('sendMessage', message.tempId, message);
    }
};
