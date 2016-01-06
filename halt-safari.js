/**
 * @module ImageHaltSafari
 * image-halt v0.0.1
 */
(function (factory) {
  'use strict';

  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    window.ImageHaltSafari = factory();
  }
}(function factory() {
  'use strict';

  return {
    /* Implementation to start downloading the image.
     * @override, private, abstract
     */
    __load: function __load() {
      if (typeof this._iframe === 'undefined') {
        this._iframe = document.createElement('iframe');
        this._iframe.setAttribute('src', 'about:blank');
        this._iframe.style.display = 'none';
        document.body.appendChild(this._iframe);
        this._iframe.contentDocument.body.appendChild(this._image);
      }
      this._image.setAttribute('src', this.imageSource);
    },

    /* Implementation to halt the image download.
     * @override, private, abstract
     */
    __abort: function __abort() {
      this._iframe.contentWindow.stop();
    },

    /* Implementation to clear the instance references.
     * @override, private, abstract
     */
    __destroy: function __destroy() {
      document.body.removeChild(this._iframe);
      this._iframe = null;
    }
  };
}));
