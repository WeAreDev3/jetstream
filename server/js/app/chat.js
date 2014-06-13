var Chat = Chat || function(data, parent) {
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

Chat.prototype.checkInput = function(e) {
    var input = this.el.getElementsByTagName('input')[0],
        message;

    if (e.keyCode === 13 && input.value.trim() !== '') {
        message = new Message({
            id: Math.floor(Math.random() * 1000),
            message: input.value,
            chatId: this.id,
            userId: currentUser.id,
            timestamp: (new Date()).toISOString()
        });
        input.value = '';
        console.log('Sent a message:', message);
        socket.emit('message', message);
    }
};
