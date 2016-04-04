'use strict';
const path = require('path');
const shell = require('shelljs');
const userHome = require('user-home');

// Cache some values for increased performance (less file IO)
const appState = {
	themes: null
};

// Get the path to the .linear config location
function settingsPath(file) {
	file = file || '';
	return path.join(userHome, '.linear', file);
}

// Get the path to the .linear config themes location
function themesPath(file) {
	file = file || '';
	return path.join(userHome, '.linear', 'themes', file);
}

// Get the path to the .linear defaults location
function defaultsPath(file) {
	file = file || '';
	return path.join(process.cwd(), 'src', 'defaults', 'config', '.linear', file);
}

// Set settings.json as the main config file
// but also listen for command-line args for debugging
const nconf = require('nconf')
	.argv()
	.file({file: settingsPath('settings.json')});

// Save key/value to the settings.json file
function saveSettings(settingKey, settingValue) {
	nconf.set(settingKey, settingValue);
	nconf.save();
}

// Read a value from the settings.json file
function readSettings(settingKey) {
	nconf.load();
	return nconf.get(settingKey);
}

// Setup/check the .linear config files
function init() {
	return new Promise(resolve => {
		// does the user have a .linear file (not a directory)?
		if (shell.test('-f', settingsPath())) {
			// remove the .linear file from older installations of linear
			shell.rm('-rf', settingsPath());
		}

		// get a list of files (if any) at the default location
		const settingsFiles = shell.ls(settingsPath());

		if (settingsFiles.length === 0) {
			// No settings exist. Copy the defaults to the settings location
			shell.cp('-R', defaultsPath(), settingsPath());
		} else if (settingsFiles.indexOf('themes') === -1) {
			// No themes exist. Copy the default themes to the settings location
			shell.cp('-r', defaultsPath('themes'), settingsPath());
		} else if (settingsFiles.indexOf('settings.json') === -1) {
			// Copy the missing settings file to the settings location
			shell.cp('-R', defaultsPath('settings.json'), settingsPath());
		}
		// setup the cache
		appState.themes = getThemes();

		resolve();
	});
}

// Force the reloading of the default .linear config files
// Note: This function is [currently] not used anywhere in the app,
// but can be used in the future to "restore defaults" from the settings UI.
function reloadDefaults() {
	shell.cp('-Rf', defaultsPath(), settingsPath());
}

// Get the names of all the themes installed
function getThemes() {
	return appState.themes || shell.ls(settingsPath('themes'));
}

// Checks if --debug flag was passed
function debug() {
	const args = nconf.stores.argv.store;
	return args && args.hasOwnProperty('debug');
}

// Public API
module.exports = {
	reloadDefaults,
	saveSettings,
	readSettings,
	themesPath,
	getThemes,
	debug,
	init
};
