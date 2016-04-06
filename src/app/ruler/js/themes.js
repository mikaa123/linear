/* eslint-disable no-undef */
'use strict';
const titleCase = require('title-case');

const menus = {
	theme: document.querySelector('.themeMenu')
};

document.querySelector('.themeIcon').addEventListener('click', () => {
	toggleThemeMenu();
});

// Show or hide the themeMenu's visibility
function toggleThemeMenu() {
	menus.theme.classList.toggle('zeroOpacity');
}

// Setup function called via ruler.html's onpageload event
window.initPageTheme = function () {
	updateTheme();
	buildThemeMenu();
};

// Physically construct the themeMenu for ruler.html
function buildThemeMenu() {
	const ul = document.createElement('ul');
	dataStore.getThemes().forEach(name => {
		const li = document.createElement('li');
		li.innerText = titleCase(name.replace('.css', ''));
		li.setAttribute('data-filename', name);
		li.setAttribute('class', 'themeBtn');
		ul.appendChild(li);
	});
	menus.theme.appendChild(ul);

	const btns = document.querySelectorAll('.themeBtn');

	[].forEach.call(btns, btn => {
		const filename = btn.getAttributeNode('data-filename').value;

		btn.addEventListener('click', () => {
			updateTheme(filename);
		});
	});
	updateThemeMenu();
}

// Listener for the update-theme event. Dispatched by 'apply-default-theme'
ipc.on('update-theme', (evt, data) => {
	updateTheme(data.filename);
});

// Update the theme in the global dataStore and set ruler.html's stylesheet
function updateTheme(filename) {
	filename = filename || dataStore.readSettings('theme');
	document.getElementById('rulertheme').setAttribute('href', dataStore.themesPath(filename));
	updateThemeMenu();
}

// Update the selected theme on ruler.html's #themeMenu
function updateThemeMenu() {
	const pageTheme = getPageTheme();
	const btns = document.querySelectorAll('.themeBtn');

	[].forEach.call(btns, btn => {
		const filename = btn.getAttributeNode('data-filename').value;

		btn.classList.remove('checkmark');
		if (filename === pageTheme) {
			btn.classList.add('checkmark');
		}
	});
}

// Get the theme used on the current ruler.html page
function getPageTheme() {
	return document.getElementById('rulertheme').getAttribute('href').split('/').pop();
}

