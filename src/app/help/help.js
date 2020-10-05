'use strict';

const { ipcRenderer, remote } = require('electron');
const browserWindow = remote.getCurrentWindow();
const dataStore = require('../../data-store');

// When the help menu is loaded, we create a ruler
// so the user can get a feel of how to use them.
ipcRenderer.send('create-ruler', {
	x: browserWindow.getPosition()[0] + 274,
	y: browserWindow.getPosition()[1] + 250
});

let currentStep = 0;
document.querySelector('.help-wrapper__close').addEventListener('click', () => browserWindow.close());
document.querySelector('.next-step').addEventListener('click', () => {
	document.querySelector(`.step--${++currentStep}`).style.opacity = 1;

	if (currentStep === 5) {
		document.querySelector('.next-step .btn__inner').textContent = 'Got it!';
		document.querySelector('.next-step').addEventListener('click', () => {
			dataStore.saveSettings('tutorialShown', true);
			browserWindow.close();
		});
	}
});
