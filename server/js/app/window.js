var Win = Win || function (el) {
    this.el = el;


    this.drag = this.handleDrag.bind(this); // Because the bind() needs caching
    this.el.window = this;
    console.log(this.el);
};

Win.prototype.handleDrag = function (e) {
    var rect = this.el.getBoundingClientRect();
    this.el.style.position = 'fixed';
    this.el.style.top = rect.top + e.clientY - this.mouseY + 'px';
    this.el.style.left = rect.left + e.clientX - this.mouseX + 'px';
    this.mouseY = e.clientY;
    this.mouseX = e.clientX;
};
