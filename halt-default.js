/**
 * @module ImageHaltDefault
 * image-halt v0.0.1
 */
(function (factory) {
  'use strict';

  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    window.ImageHaltDefault = factory();
  }
}(function factory() {
  'use strict';

  return {
    /* Implementation to start downloading the image.
     * @override, private, abstract
     */
    __load: function __load() {
      this._image.setAttribute('src', this.imageSource);
    },

    /* Implementation to halt the image download.
     * @override, private, abstract
     */
    __abort: function __abort() {
      this._image.setAttribute('src', this._BLANK);
    },

    /* Implementation to clear the instance references.
     * @override, private, abstract
     */
    __destroy: function __destroy() {
      /* silence */
    }
  };
}));
