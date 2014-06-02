var Chat = Chat || function (data, parent) {
    this.users = [];
    for (var i = data.users.length - 1; i >= 0; i--) {
        this.users.push(users[data.users[i]].displayName);
    }

    this.name = data.name ? data.name : this.users.join(', ');
    this.id = data.id;

    this.initElement(parent);
};

Chat.prototype.initElement = function(parent) {
    parent = parent || document.body;

    var container = document.createElement('div'),
        header = document.createElement('header'),
        content = document.createElement('section');
    container.id = this.id;
    container.classList.add('chat');
    header.textContent = this.name;

    container.appendChild(header);
    container.appendChild(content);
    parent.appendChild(container);
};