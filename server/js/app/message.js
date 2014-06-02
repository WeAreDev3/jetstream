var Message = Message || function (data) {
    this.id = data.id;
    this.content = data.message;
    this.chatId = data.chatId;
    this.user = users[data.userId];
    this.timestamp = new Date(data.timestamp);

    this.initElement();
};

Message.prototype.initElement = function() {
    var parent = document.getElementById(this.chatId).getElementsByTagName('section')[0],
        container = document.createElement('div'),
        pic = document.createElement('img'),
        content = document.createElement('div'),
        user = document.createElement('div'),
        date = document.createElement('div'),
        time = document.createElement('div'),
        message = document.createElement('div');
    container.id = this.id;
    container.classList.add('message', (this.user.username === currentUser.id ? 'right': 'left'));
    pic.src = this.user.imgUrl;
    content.classList.add('message-content');
    user.classList.add('message-user');
    date.classList.add('message-date');
    time.classList.add('message-time');
    message.classList.add('message-text');
    user.textContent = this.user.displayName;
    date.textContent = parseDate(this.timestamp);
    time.textContent = parseTime(this.timestamp);
    message.textContent = this.content;

    content.appendChild(user);
    content.appendChild(date);
    content.appendChild(time);
    content.appendChild(message);
    container.appendChild(pic);
    container.appendChild(content);
    parent.appendChild(container);
};