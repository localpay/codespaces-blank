var Spinner = function() {
    this.spinnerClassName = 'spinner';
    this.activeClassName = 'active';
}

Spinner.prototype.getLoaderElementInDocument = function() {
    var self = this;

    return document.getElementsByClassName(self.spinnerClassName)?.[0];
}

Spinner.prototype.startLoading = function() {
    var self = this;

    var spinner = self.getLoaderElementInDocument();
    if (spinner && spinner.classList) {
        spinner.classList.add(self.activeClassName);
    }
}

Spinner.prototype.stopLoading = function() {
    var self = this;

    var spinner = self.getLoaderElementInDocument();
    if (spinner && spinner.classList) {
        spinner.classList.remove(self.activeClassName);
    }
    
}