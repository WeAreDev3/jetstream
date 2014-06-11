var SidebarItem = SidebarItem || function(id, imageUrl, titleText, subTitleText, metaInfo, onclick) {
    var container,
        title,
        subTitle,
        meta,
        image;

    container = document.createElement('li');
    image = document.createElement('img');
    title = document.createElement('h3');
    subTitle = document.createElement('h4');

    if (metaInfo && typeof metaInfo !== 'function') {
        meta = document.createElement('h5');
        meta.textContent = metaInfo;
    } else if (typeof metaInfo === 'function') {
        onclick = metaInfo;
    }

    container.dataset.id = id;

    image.src = imageUrl;
    image.alt = titleText;
    image.classList.add('profilePic');

    title.textContent = titleText;
    subTitle.textContent = subTitleText;

    container.onclick = onclick;

    container.appendChild(image);
    container.appendChild(title);
    container.appendChild(subTitle);

    if (meta) {
        container.appendChild(meta);
    }

    return container;
};