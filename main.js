'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipc = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
const path = require('path');

let rulers = [];
let mainWindow;
let settingsWindow;

/**
 * Create a ruler window and push it to the `rulers` array. The ruler window
 * is frameless, transparent and resizable. This type of windows might not be
 * well supported on every platforms.
 * @param {Object} windowInfo - Size and position of the window
 */
function createNewRuler(windowInfo) {
	let _windowInfo = windowInfo || {};
	let ruler = new BrowserWindow({
		width: _windowInfo.width || 151,
		height: _windowInfo.height || 126,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		x: _windowInfo.x,
		y: _windowInfo.y,
		'min-width': 151,
		'min-height': 126,
		'standard-window': false,
		'use-content-size': true
	});

	ruler.loadURL(`file://${__dirname}/src/app/ruler/ruler.html`);

	ruler.on('closed', () => {
		rulers.splice(rulers.indexOf(ruler), 1);
		ruler = undefined;
	});

	rulers.push(ruler);
}

let hidden = false;

/**
 * Toggle a ruler asynchronously and give back a promise.
 * @param	{BrowserWindow} ruler - The ruler to toggle
 * @return {Promise}
 */
let toggleRuler = (ruler) => {
	return new Promise((resolve) => setTimeout(() => {
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

	// Close all rulers sequencially. Doing otherwise doesn't toggle them
	// properly. This is most likely an issue with Electron.
	rulers.slice(1).reduce((acc, val) => {
		return acc.then(() => toggleRuler(val));
	}, toggleRuler(rulers[0]));
}

app.on('ready', function() {
	let trayIcon = new Tray(path.join(__dirname, 'src/assets/images/lrTemplate.png'));

	var trayMenuTemplate = [
			{
					label: 'New ruler',
					accelerator: 'Command+Ctrl+R',
					click: createNewRuler
			},
			{
					label: 'Toggle rulers',
					accelerator: 'Command+Ctrl+T',
					click: toggleRulerCommand,
					enabled: false
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
						width: 200,
						height: 170,
						alwaysOnTop: true
					});

					settingsWindow.loadURL(`file://${__dirname}/src/app/settings/settings.html`);

					settingsWindow.on('closed', () => {
						settingsWindow = null;
					});
				}
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

	let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
	let toggleRulersMenu = trayMenu.items[1];
	trayIcon.setContextMenu(trayMenu);

	// Application menu
	let appMenu = Menu.buildFromTemplate([{
		label: require('electron').app.getName(),
		submenu: [{
				label: 'Quit',
				accelerator: 'Command+Q',
				click: () => app.quit()
		}]
	},{
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
	Array.observe(rulers, () => toggleRulersMenu.enabled = !!rulers.length);

	globalShortcut.register('Command + Control + T', toggleRulerCommand);
	globalShortcut.register('Command + Control + R', createNewRuler);

	createNewRuler();
});

// We make sure not to quit when every windows are closed.
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

// Let rulers know that a config changed. For instance, the application uses
// 'em' instead of 'px' as units.
ipc.on('settings-changed', () => {
	rulers.forEach((ruler) => ruler.send('settings-changed'));
});

// Duplicate a given ruler.
ipc.on('duplicate-ruler', (evt, duplicateInfo) => {
	createNewRuler(duplicateInfo);
});
