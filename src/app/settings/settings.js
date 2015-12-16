'use strict';

const dataStore = require('../../data-store');
const ipc = require('electron').ipcRenderer;

const inputs = {
	px: document.querySelector('#px'),
	em: document.querySelector('#em'),
	size: document.querySelector('[name=size]')
};

/**
 * Decorate a function with a `settings-changed` event.
 * @param {Function} cb - The function to decorate.
 * @return {Function} The decorated function.
 */
let settingsChangedDecorator = (cb) => (evt) => {
	cb(evt);
	ipc.send('settings-changed');
};

/**
 * Load saved data from the `dataStore` and populate the view with it.
 */
function loadSettings() {
	let unit = dataStore.readSettings('unit') || 'px';
	let size = dataStore.readSettings('size') || '16';

	inputs[unit].checked = true;
	inputs.size.value = size;
}

['px', 'em'].forEach((radio) => {
	inputs[radio].addEventListener('change', settingsChangedDecorator((evt) => {
		dataStore.saveSettings('unit', evt.target.value);
	}));
});

inputs.size.addEventListener('keyup', settingsChangedDecorator((evt) => {
	dataStore.saveSettings('size', evt.target.value);
}));

loadSettings();
