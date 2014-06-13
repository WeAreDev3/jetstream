var Message = Message || function(data) {
    var self = this;
    this.id = data.id;
    this.content = data.message;
    this.chatId = data.chatId;
    this.user = users[data.userId];
    this.timestamp = new Date(data.timestamp);

    this.initElement();
    app.messages.push(this);

    return {
        chatId: self.chatId,
        message: self.content
    };
};
