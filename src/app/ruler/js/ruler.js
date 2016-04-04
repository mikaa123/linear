'use strict';

const remote = require('electron').remote;
const browserWindow = remote.getCurrentWindow();
const dataStore = require('../../data-store');
const ipc = require('electron').ipcRenderer;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const borders = {
	top: document.querySelector('.ruler__inner__border--top'),
	right: document.querySelector('.ruler__inner__border--right'),
	bottom: document.querySelector('.ruler__inner__border--bottom'),
	left: document.querySelector('.ruler__inner__border--left')
};

const info = {
	width: document.querySelector('.ruler__inner__info__width'),
	height: document.querySelector('.ruler__inner__info__height')
};

const centerGuides = {
	vertical: document.querySelector('.center-guide__vertical'),
	horizontal: document.querySelector('.center-guide__horizontal')
};

let showCenterGuides = false;

// Used to calculate em.
let baseFontSize;

let isShiftDown = false;

// This object holds the different strategies for displaying units.
const unitStrategies = {
	/**
	 * The px format.
	 * @param {Number} px - The number of px to display.
	 * @return {String} A formatted string displaying px.
	 */
	px(px) {
		return `${px}px`;
	},

	/**
	 * The em format.
	 * @param {Number} em - The number to convert to em.
	 * @return {String} A formatted string displaying em.
	 */
	em(em) {
		return `${em / baseFontSize}em`;
	}
};

let displayStrategy;

/**
 * Load saved data from the `dataStore` and populate the view with it.
 */
function loadSettings() {
	const unit = dataStore.readSettings('unit') || 'px';
	baseFontSize = dataStore.readSettings('size') || '16';

	displayStrategy = unitStrategies[unit];
	updateMeasures();
}

/**
 * Update the values in the view based on the `displayStrategy`.
 */
function updateMeasures() {
	info.width.textContent = displayStrategy(borders.right.getBoundingClientRect().left - borders.left.getBoundingClientRect().left);
	info.height.textContent = displayStrategy(borders.bottom.getBoundingClientRect().top - borders.top.getBoundingClientRect().top);
}

const contextMenu = new Menu();
contextMenu.append(new MenuItem({
	label: 'Duplicate',

	// Duplicate the current ruler. We send position information to the main
	// process so that it can create a new window at the same spot.
	click: () => {
		const bounds = browserWindow.getBounds();
		const position = browserWindow.getPosition();

		ipc.send('create-ruler', {
			x: position[0],
			y: position[1],
			width: bounds.width,
			height: bounds.height
		});
	}
}));

window.addEventListener('keydown', evt => {
	const shift = 16;

	switch (evt.keyCode) {
		case shift:
			isShiftDown = true;
			break;
		default:

	}
});

window.addEventListener('keyup', evt => {
	// Keycodes for arrowkeys and shift.
	const up = 38;
	const down = 40;
	const left = 37;
	const right = 39;
	const shift = 16;

	// Grabbing the current position to add to it.
	const position = browserWindow.getPosition();
	const x = position[0];
	const y = position[1];

	// Figuring out if shiftKey is down to increment by 10px or just 1px
	const increment = isShiftDown ? 10 : 1;

	switch (evt.keyCode) {
		case shift:
			isShiftDown = false;
			break;
		case up:
			browserWindow.setPosition(x, y - increment, true);
			break;
		case down:
			browserWindow.setPosition(x, y + increment, true);
			break;
		case right:
			browserWindow.setPosition(x + increment, y, true);
			break;
		case left:
			browserWindow.setPosition(x - increment, y, true);
			break;
		default:
	}
});

window.addEventListener('contextmenu', e => {
	e.preventDefault();
	contextMenu.popup(remote.getCurrentWindow());
}, false);

document.querySelector('.ruler__inner__close').addEventListener('click', () => browserWindow.close());

window.addEventListener('resize', updateMeasures);

ipc.on('settings-changed', loadSettings);
ipc.on('toggle-center-guides', toggleCenterGuides);

function toggleCenterGuides() {
	showCenterGuides = !showCenterGuides;

	if (showCenterGuides) {
		centerGuides.vertical.classList.remove('hidden');
		centerGuides.horizontal.classList.remove('hidden');
	} else {
		centerGuides.vertical.classList.add('hidden');
		centerGuides.horizontal.classList.add('hidden');
	}
}

loadSettings();
