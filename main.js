'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipc = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
const path = require('path');
const dataStore = require('./src/data-store');

// Show debug tools in debugging mode.
if (dataStore.debug()) {
	require('electron-debug')({showDevTools: true});
}

const rulers = [];
let settingsWindow;
let helpWindow;
let lastFocusedRuler;

/**
 * Create a ruler window and push it to the `rulers` array. The ruler window
 * is frameless, transparent and resizable. This type of window might not be
 * well supported on every platform.
 * @param {Object} windowInfo - Size and position of the window
 */
function createNewRuler(windowInfo) {
	const _windowInfo = windowInfo || {};
	let ruler = new BrowserWindow({
		'width': _windowInfo.width || 201,
		'height': _windowInfo.height || 151,
		'frame': false,
		'transparent': true,
		'alwaysOnTop': true,
		'x': _windowInfo.x,
		'y': _windowInfo.y,
		'min-width': 101,
		'min-height': 101,
		'standard-window': false,
		'use-content-size': true
	});

	ruler.loadURL(`file://${__dirname}/src/app/ruler/ruler.html`);

	ruler
		.on('closed', () => {
			rulers.splice(rulers.indexOf(ruler), 1);
			ruler = undefined;
		})
		.on('focus', () => {
			lastFocusedRuler = ruler;
		});

	lastFocusedRuler = ruler;
	rulers.push(ruler);
}

/**
 * Toggle the visibility of the Center Guides in the active ruler
 */
function toggleCenterGuidesCommand() {
	if (lastFocusedRuler) {
		lastFocusedRuler.send('toggle-center-guides');
	}
}

/**
 * Show the help page for better onboarding.
 */
function showHelp() {
	if (helpWindow) {
		return;
	}

	helpWindow = new BrowserWindow({
		width: 700,
		height: 570,
		frameless: true,
		frame: false,
		resizable: false
	});

	helpWindow.loadURL(`file://${__dirname}/src/app/help/help.html`);

	helpWindow.on('closed', () => {
		helpWindow = null;
	});
}

let hidden = false;

/**
 * Toggle a ruler asynchronously and give back a promise.
 * @param {BrowserWindow} ruler - The ruler to toggle
 * @return {Promise}
 */
const toggleRuler = ruler => {
	return new Promise(resolve => setTimeout(() => {
		ruler[hidden ? 'hide' : 'show']();
		resolve();
	}));
};

/**
 * Show/Hide rulers on the screen.
 */
function toggleRulerCommand() {
	if (!rulers.length) {
		return;
	}

	hidden = !hidden;

	// Close all rulers sequentially. Doing otherwise doesn't toggle them
	// properly. This is most likely an issue with Electron.
	rulers.slice(1).reduce((acc, val) => {
		return acc.then(() => toggleRuler(val));
	}, toggleRuler(rulers[0]));
}

app.dock.hide();
app.on('ready', () => {
	dataStore.init().then(setup);
});

function setup() {
	const trayIcon = new Tray(path.join(__dirname, 'src/assets/images/lrTemplate.png'));

	const trayMenuTemplate = [
		{
			label: 'New Ruler',
			accelerator: 'Command+Ctrl+R',
			click: createNewRuler
		},
		{
			label: 'Toggle Rulers',
			accelerator: 'Command+Ctrl+T',
			click: toggleRulerCommand,
			enabled: false
		},
		{
			label: 'Toggle Center Guides',
			accelerator: 'Command+;',
			click: toggleCenterGuidesCommand,
			enabled: true
		},
		{
			type: 'separator'
		},
		{
			label: 'Settings',
			click: () => {
				if (settingsWindow) {
					return;
				}

				settingsWindow = new BrowserWindow({
					width: 325,
					height: 325,
					alwaysOnTop: true
				});

				settingsWindow.loadURL(`file://${__dirname}/src/app/settings/settings.html`);

				settingsWindow.on('closed', () => {
					settingsWindow = null;
				});
			}
		},
		{
			label: 'Help',
			click: showHelp
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			accelerator: 'Command+Q',
			click: () => app.quit()
		}
	];

	const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
	const toggleRulersMenu = trayMenu.items[1];
	trayIcon.setContextMenu(trayMenu);

	// Application menu
	const appMenu = Menu.buildFromTemplate([{
		label: require('electron').app.getName(),
		submenu: [{
			label: 'Quit',
			accelerator: 'Command+Q',
			click: () => app.quit()
		}]
	}, {
		label: 'Window',
		role: 'window',
		submenu: [{
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close'
		}]
	}]);
	Menu.setApplicationMenu(appMenu);

	// We observe changes on the `rulers` array to enable/disable the toggle menu.
	Array.observe(rulers, () => {
		toggleRulersMenu.enabled = Boolean(rulers.length);
	});

	globalShortcut.register('Command + Control + T', toggleRulerCommand);
	globalShortcut.register('Command + Control + R', createNewRuler);
	globalShortcut.register('Command + ;', toggleCenterGuidesCommand);

	// Show help the first time the app is launched.
	if (dataStore.readSettings('tutorialShown')) {
		// We create the new ruler on next tick, otherwise it isn't always created.
		setTimeout(createNewRuler);
	} else {
		showHelp();
	}
}

// We make sure not to quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// Let rulers know that a config changed. For instance, the application uses
// 'em' instead of 'px' as units.
ipc.on('settings-changed', () => {
	rulers.forEach(ruler => ruler.send('settings-changed'));
});

// Update the themes of all open rulers on default theme change
ipc.on('apply-default-theme', (evt, data) => {
	rulers.forEach(ruler => ruler.send('update-theme', {filename: data.filename}));

	// Focus all rulers temporarily to apply the changes.
	// See: https://github.com/mikaa123/linear/issues/27
	setTimeout(() => {
		rulers.forEach(ruler => ruler.focus());
	}, 300);
});

// Duplicate a given ruler.
ipc.on('create-ruler', (evt, rulerInfo) => {
	// Offset new duplicate ruler to make it more evident.
	rulerInfo.x += 10;
	rulerInfo.y += 10;

	createNewRuler(rulerInfo);
});
