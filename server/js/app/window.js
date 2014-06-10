var Win = Win || function(el) {
    this.el = el;

    this.drag = this.handleDrag.bind(this); // Because the bind() needs caching
    this.el.window = this;
};

Win.prototype.handleDrag = function(e) {
    var rect = this.el.getBoundingClientRect(),
        top = rect.top + e.clientY - this.mouseY,
        left = rect.left + e.clientX - this.mouseX,
        selectable = document.getElementsByClassName('selectable');

    for (var i = selectable.length - 1; i >= 0; i--) {
        selectable[i].classList.remove('selectable');
    }

    if (top >= 0) {
        this.el.style.top = top + 'px';
        this.mouseY = e.clientY;
    } else {
        this.el.style.top = 0 + 'px';
    }

    if (left >= 0) {
        if (left + rect.width <= window.innerWidth) {
            this.el.style.left = left + 'px';
            this.mouseX = e.clientX;
        } else {
            this.el.style.left = window.innerWidth - rect.width + 'px';
        }
    } else {
        this.el.style.left = 0 + 'px';
    }
};
