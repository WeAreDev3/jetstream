var FriendList = FriendList || function(friends, parent) {
    this.friends = friends;

    this.title = 'Friend List';

    this.initElement(parent);
    this.window = new Win(this.el);
};

FriendList.prototype.initElement = function(parent) {
    parent = parent || document.body;

    var container = document.createElement('div'),
        header = document.createElement('header'),
        searchBar = document.createElement('div'),
        searchIcon = document.createElement('span'),
        input = document.createElement('input'),
        content = document.createElement('section');

    container.id = 'friendList';
    container.classList.add('friendList');
    header.textContent = 'Friends';
    searchBar.classList.add('searchBar');
    searchIcon.classList.add('icon-search');
    input.autocomplete = 'off';
    input.placeholder = 'Find a friend';
    input.onkeyup = this.checkInput.bind(this);

    this.el = container;

    searchBar.appendChild(searchIcon);
    searchBar.appendChild(input);
    container.classList.add('chat');
    container.appendChild(header);
    container.appendChild(searchBar);
    container.appendChild(content);
    parent.appendChild(container);
};

FriendList.prototype.checkInput = function(e) {
    var input = this.el.getElementsByTagName('input')[0];

    new Friend('', '', '', '', true);

    if (input.value.trim() !== '') {
        this.el.getElementsByClassName('searchBar')[0].getElementsByClassName('friend')[0].classList.remove('noShow');
        socket.emit('getIdFromUsername', input.value);
    } else {
        this.el.getElementsByClassName('searchBar')[0].getElementsByClassName('friend')[0].classList.add('noShow');
    }
};
