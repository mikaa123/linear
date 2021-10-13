# Linear

![Linear Img](http://mikaa123.github.io/linear-website/images/screenshot.png)

Linear is a ruler application for Mac, made with web development in mind.
It sits in your menu bar and doesn't get in your way. Here are a few highlights:

* Linear is not a browser extension. Browser extensions are really useful, but fall
short when inspecting the DOM of a document, since they often inject overlay
elements themselves.
* Uses `px` or `em` values; set the default font-size to your convenience.
* Create multiple rulers.
* Duplicate a ruler, preserving its height and width. Really useful when checking margins.
* Default themes adapt to dark and light backgrounds.
* System-wide shortcuts to hide/show rulers.
* Fine-tune a ruler's positions using arrow keys. Hold shift for faster move (thanks to [@gtagle](https://github.com/gtagle)).
* Show center guides (thanks to [@radiovisual](https://github.com/radiovisual)).
* Fully customizable CSS themes (thanks to [@radiovisual](https://github.com/radiovisual)).  

Here is a [video](https://www.youtube.com/watch?v=VcozN5LwLEw#action=share) to get you started.

Linear is proudly built with [Electron](https://github.com/atom/electron).

## Installing
Download the [latest build](https://github.com/mikaa123/linear/releases) or install via homebrew (thanks to [@goronfreeman](https://github.com/goronfreeman)):

```
$ brew install linear
```

## Caveats
Linear uses a transparent, resizable frameless window, which is rather experimental.
This is why Mac is the only supported platform at the moment.

## Customizable Themes
Creating your own linear theme is as simple as adding a custom css file to linear's theme directory.
Linear will use the name of your custom css file as the name of your theme. Follow these steps to get you started:

1. **Copy** the `universal.css` file and **rename** it to your new theme name (e.g. `my-awesome-theme.css`).
2. **Edit** your custom css file to get the look you want.
3. **Save** your custom css to linear's theme directory: `/Users/<username>/.linear/themes`
4. **Open** (or restart) the linear application. 
5. **Select** your new theme by clicking on the 'theme icon' on the bottom right corner of your ruler. 
6. You can also set your new theme to the Default Theme in the settings menu.

**Tip:** Linear will titlecase your css files to generate your theme name. For example, a file named `my-awesome-theme.css` will be seen in linear as `My Awesome Theme`.

## Contributing
Any contribution is welcome, in fact, you'll receive an instant hug for doing one. ;)
Linear was built as a side project and is a little rough around the edges, so even bug reports would be great.
 
### Development
After you've cloned or forked the repo, you'll need to install the dependencies (like Electron, etc):

```
$ npm install
```

Then to start the app:

```
$ npm start
```

To start in debug mode (attaches chrome developer tools):

```
$ npm debug
```

## License

MIT © [The UX Shop](http://www.theuxshop.com)
