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

Linear is proudly build with [Electron](https://github.com/atom/electron).

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
