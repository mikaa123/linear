'use strict';

const path = require('path');
const nconf = require('nconf').file({
	file: path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.linear')
});

module.exports = {
	saveSettings: function saveSettings(settingKey, settingValue) {
		nconf.set(settingKey, settingValue);
		nconf.save();
	},

	readSettings: function readSettings(settingKey) {
		nconf.load();
		return nconf.get(settingKey);
	}
};
