# image-halt

Preload images with an option to cancel the transfer if needed without stoping
the window loading.

[Read the Specification](https://github.com/noeldelgado/image-halt/wiki/Spec)

## Installation

**NPM**

```sh
npm i image-halt --save
```

## Usage

```js
var ImageHalt = require('image-halt');

var paths = ['a.jpg', 'b.png', 'c.gif'];
var images = [];

function handleImageLoad(err, image) {
	if (err) { // handle the error
		return;
	}
	
	document.body.appendChild(image);
}

// register 
paths.forEach(function(path) {
	images.push( new ImageHalt(path, handleImageLoad).load() );
});

// ...
// later on we cancel them
images.forEach(function(image) {
	if (image.isLoaded() === false) {
		image.abort();
	}
});
```

## Basic Methods

name | description | return
---|---|---
load | Creates a new in-memory image object and start listening for it to load. | self
abort | Cancel the image transfer. | self

## Other Methods

name | description | return
---|---|---
isLoaded | Returns whether or not the image has already been loaded. | Boolean

## License
MIT © [Noel Delgado](http://pixelia.me/)