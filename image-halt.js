/**
 * image-halt v0.0.1
 * https://github.com/noeldelgado/image-halt
 * License MIT
 */
(function (factory) {
  'use strict';

  if (typeof exports === 'object')  {
    module.exports = factory(
      require('./halt-default'),
      require('./halt-safari')
    );
  } else {
    window.ImageHalt = factory(
      window.ImageHaltDefault,
      window.ImageHaltSafari
    );
  }
}(function factory(ImageHaltDefault, ImageHaltSafari) {
  'use strict';

  /* Main Class. Holds the behaviour that can run on all implementations.
   * This class accomplishes cross-browser through a strategy of module inclusion.
   * That is that once the browser is determined, the module that holds the specific behaviour is included into the class.
   * @constructor
   * @argument {string} imageSource - path to the image file
   */
  function ImageHalt(imageSource, callback, options) {
    this.imageSource = imageSource;
    this.callback = callback;
    this.options = options;

    this._BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    this._image = null;
    this.__loaded = false;
  }

  /* Includes the specific behaviour of the passed implementation into the class.
   * @private
   */
  function include(implementation) {
    var property;
    for (property in implementation) {
      if (implementation.hasOwnProperty(property)) {
        ImageHalt.prototype[property] = implementation[property];
      }
    }
  }

  /* Holds the implementation Object.
   * @protected, static
   * @property {Object} [ImageHaltDefault]
   */
  ImageHalt._implementation = ImageHaltDefault;

  /* Based in the natigator.userAgent, checks if the implementation needs to be changed.
   * @protected, static
   */
  ImageHalt._updateImplementation = function _updateImplementation() {
    if (/^((?!chrome).)*safari/i.test(window.navigator.userAgent)) {
      this._implementation = ImageHaltSafari;
    }
  };

  ImageHalt.prototype = {
    /* Creates a new image object and start listening for it to load.
     * @public
     * @return {Object} ImageHalt
     */
    load: function load() {
      if (this.__loaded === true) {
        console.warn('Calling load on loaded image');
        return this;
      }

      if (this._image) {
        this._unsubscribe();
        this._image = null;
      }

      this._image = new Image();
      this._subscribe().__load();

      return this;
    },

    /* Returns true if the image has been loaded already, or false if it has not.
     * @public
     * @returns {Boolean} if the image has already been loaded
     */
    isLoaded: function isLoaded() {
      return this.__loaded;
    },

    /* Cancel the image transfer.
     * @public
     * @return {Object} ImageHalt
     */
    abort: function abort() {
      if (this.__loaded === true) {
        console.warn('Calling abort on loaded image');
        return this;
      }

      this._unsubscribe().__abort();

      return this;
    },

    /* Bind event handlers for image object.
     * @private
     * @return {Object} ImageHalt
     */
    _subscribe: function _subscribe() {
      this._loadHandlerRef = this._loadHandler.bind(this);
      this._image.addEventListener('load', this._loadHandlerRef);

      this._errorHandlerRef = this._errorHandler.bind(this);
      this._image.addEventListener('error', this._errorHandlerRef);

      return this;
    },

    /* Unbind events handlers forw the image object.
     * @private
     * @return {Object} ImageHalt
     */
    _unsubscribe: function _unsubscribe() {
      this._image.removeEventListener('load', this._loadHandlerRef);
      this._loadHandlerRef = null;

      this._image.removeEventListener('error', this._errorHandlerRef);
      this._errorHandlerRef = null;

      return this;
    },

    _loadHandler: function _loadHandler() {
      this.__loaded = true;
      this._destroy().callback(null, this._image, this.options);
    },

    _errorHandler: function _errorHandler(ev) {
      this.callback(new Error(ev), this._image, this.options);
    },

    /* Unbind events (if needed), nullify references and remove elements.
     * @private
     * @return {Object} ImageHalt
     */
    _destroy: function destroy() {
      this._unsubscribe().__destroy();
      return this;
    },

    /* Implementation to start fetching the image.
     * Based on the userAgent we may have to do different things so we can later abort the image loading if needed.
     * All implementations should include this method.
     * @private, abstract
     */
    __load: function __load() {
      throw new Error('ImageHalt.prototype._load not implemented');
    },

    /* Implementation to halt the image loading.
     * Browsers can handle this differently, so based on userAgent we can determine which module to load.
     * All implementations should include this method.
     * @private, abstract
     */
    __abort: function _abort() {
      throw new Error('ImageHalt.prototype._abort not implemented');
    },

    /* Implementation of _destroy.
     * All implementations should include this method.
     * @private, abstract
     */
    __destroy: function _destroy() {
      throw new Error('ImageHalt.prototype._destroy not implemented');
    }
  };

  ImageHalt._updateImplementation();
  include(ImageHalt._implementation);

  return ImageHalt;
}));
