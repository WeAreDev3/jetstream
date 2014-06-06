var Chat = Chat || function (data, parent) {
    this.users = [];
    for (var i = data.users.length - 1; i >= 0; i--) {
        this.users.push(users[data.users[i]].displayName);
    }

    this.name = data.name ? data.name : this.users.join(', ');
    this.id = data.id;

    this.initElement(parent);
    this.window = new Win(this.el);
    app.chats.push(this);
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
    var input = this.el.getElementsByTagName('input')[0];
    if (e.keyCode === 13) {
        new Message({
            id: Math.floor(Math.random()*1000),
            message: input.value,
            chatId: this.id,
            userId: currentUser.id,
            timestamp: (new Date()).toISOString()
        });
        input.value = '';
    }
};