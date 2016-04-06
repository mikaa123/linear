'use strict';

const dataStore = require('../../data-store');
const ipc = require('electron').ipcRenderer;
const titleCase = require('title-case');

const inputs = {
	px: document.querySelector('#px'),
	em: document.querySelector('#em'),
	size: document.querySelector('[name=size]'),
	theme: document.querySelector('#defaultTheme'),
	applyAllThemeBtn: document.querySelector('#update-all-themes')
};

/**
 * Decorate a function with a `settings-changed` event.
 * @param {Function} cb - The function to decorate.
 * @return {Function} The decorated function.
 */
const settingsChangedDecorator = cb => evt => {
	cb(evt);
	ipc.send('settings-changed');
};

/**
 * Load saved data from the `dataStore` and populate the view with it.
 */
function loadSettings() {
	const unit = dataStore.readSettings('unit') || 'px';
	const size = dataStore.readSettings('size') || '16';
	const theme = dataStore.readSettings('theme');

	const themes = dataStore.getThemes();

	inputs[unit].checked = true;
	inputs.size.value = size;

	// build the theme options
	themes.forEach(_theme => {
		const shouldSelect = _theme === theme;
		const label = titleCase(_theme.replace('.css', ''));
		inputs.theme.appendChild(new Option(label, _theme, shouldSelect, shouldSelect));
	});
}

['px', 'em'].forEach(radio => {
	inputs[radio].addEventListener('change', settingsChangedDecorator(evt => {
		dataStore.saveSettings('unit', evt.target.value);
	}));
});

inputs.size.addEventListener('keyup', settingsChangedDecorator(evt => {
	dataStore.saveSettings('size', evt.target.value);
}));

inputs.theme.addEventListener('change', evt => {
	dataStore.saveSettings('theme', evt.target.value);
});

inputs.applyAllThemeBtn.addEventListener('click', evt => {
	const filename = inputs.theme.options[inputs.theme.selectedIndex].value;
	ipc.send('apply-default-theme', {filename});
	evt.preventDefault();
});

loadSettings();
