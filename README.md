# Linear

![Linear Img](http://mikaa123.github.io/linear-website/images/screenshot.png)

Linear is a ruler application for Mac, made with web-development in mind.
It seats in your tray-bar and doesn't get in your way. Here is what it does:

* It's not a browser extension. Browser extensions are really useful, but fail
short when inspecting the DOM of a document, since they often inject overlay
elements themselves.
* Use PX or EM, set the default font-size to your convenience.
* Create multiple rulers
* Duplicate a ruler, conserving its height and with. Really useful when checking
margins.
* It adapts to dark and light backgrounds
* System-wide shortcuts to hide/show rulers
* Fine-tune a ruler's positions using arrow keys. Hold shift for faster move. (Much thanks to [@gtagle](https://github.com/gtagle))

Here is a [video](https://www.youtube.com/watch?v=VcozN5LwLEw#action=share) to get your started.

Linear is proudly built with [Electron](https://github.com/atom/electron).

## Installing
Download the [latest build](https://github.com/mikaa123/linear/releases) or install via homebrew (much thanks to [@goronfreeman](https://github.com/goronfreeman)):

```
$ brew cask install linear
```

## Caveats
Linear uses transparent, resizable frameless window, which is rather experimental.
This is why mac is the only supported platform at this point.

## Contributing
Any contribution is welcome, in fact, you'll receive an instant hug from doing one. ;)
Linear was build as a side-project and is a little rough around the edges, so even bug reports would be great.

### Development
After you've cloned the repo, you need to install the dependencies:

```
$ npm install
```

This will install electron. Then to start the app:

```
$ npm start
```

## License

MIT © [The UX Shop](http://www.theuxshop.com)
