# Linear

![Linear Img](http://mikaa123.github.io/linear-website/images/screenshot.png)

Linear is a ruler application for Mac, made with web development in mind.
It sits in your menu bar and doesn't get in your way. Here is what it does:

* It's not a browser extension. Browser extensions are really useful, but fall
short when inspecting the DOM of a document, since they often inject overlay
elements themselves.
* Uses `px` or `em` values; set the default font-size to your convenience.
* Create multiple rulers.
* Duplicate a ruler, preserving its height and width. Really useful when checking margins.
* It adapts to dark and light backgrounds.
* System-wide shortcuts to hide/show rulers.
* Fine-tune a ruler's positions using arrow keys. Hold shift for faster move. (Much thanks to [@gtagle](https://github.com/gtagle))
* Show center guides (Much thanks to [@radiovisual](https://github.com/radiovisual))

Here is a [video](https://www.youtube.com/watch?v=VcozN5LwLEw#action=share) to get you started.

Linear is proudly built with [Electron](https://github.com/atom/electron).

## Installing
Download the [latest build](https://github.com/mikaa123/linear/releases) or install via homebrew (much thanks to [@goronfreeman](https://github.com/goronfreeman)):

```
$ brew cask install linear
```

## Caveats
Linear uses a transparent, resizable frameless window, which is rather experimental.
This is why Mac is the only supported platform at the moment.

## Contributing
Any contribution is welcome, in fact, you'll receive an instant hug for doing one. ;)
Linear was built as a side project and is a little rough around the edges, so even bug reports would be great.

### Development
After you've cloned the repo, you'll need to install the dependencies (like Electron, etc):

```
$ npm install
```

Then to start the app:

```
$ npm start
```

## License

MIT © [The UX Shop](http://www.theuxshop.com)
