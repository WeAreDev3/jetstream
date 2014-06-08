var Friend = Friend || function(displayName, username, profileUrl, spin) {
    var searchBar = document.getElementById('friendList').getElementsByClassName('searchBar')[0],
        friend = searchBar.getElementsByClassName('friend'),
        container,
        name,
        uname,
        profile;

    if (friend.length) {
        friend = friend[0];
        container = friend;
        name = friend.getElementsByTagName('h3')[0];
        uname = friend.getElementsByTagName('h4')[0];
        profile = friend.getElementsByTagName('img')[0];
    } else {
        container = document.createElement('div');
        name = document.createElement('h3');
        uname = document.createElement('h4');
        profile = document.createElement('img');
    }

    if (spin && !searchBar.classList.contains('spin')) {
        console.log('spinning up');
        name.textContent = '';
        uname.textContent = '';
        profile.src = '';

        searchBar.classList.add('spin');
        name.classList.add('icon-cog');
    } else {
        name.textContent = displayName;
        uname.textContent = username;
        profile.src = profileUrl;
    }

    if (!friend.length) {
        profile.classList.add('profilePic');
        container.classList.add('friend');
        container.appendChild(profile);
        container.appendChild(name);
        container.appendChild(uname);

        searchBar.appendChild(container);
    }
};