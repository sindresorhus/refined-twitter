import OptionsSync from 'webext-options-sync';

import {featuresDefaultValues} from './features';

const optionsSync = new OptionsSync();

// Define defaults
optionsSync.define({
	defaults: Object.assign({}, featuresDefaultValues, {
		logging: false
	}),
	migrations: [
		OptionsSync.migrations.removeUnused
	]
});

// Make sure that all features have an option value
optionsSync.getAll().then(options => {
	const newOptions = Object.assign({}, featuresDefaultValues, options);
	optionsSync.setAll(newOptions);
});

// Fix the extension when right-click saving a tweet image
browser.downloads.onDeterminingFilename.addListener((item, suggest) => {
	suggest({
		filename: item.filename.replace(/\.(jpg|png)_(large|orig)$/, '.$1')
	});
});

browser.webRequest.onBeforeRequest.addListener(({url}) => {
	if (url.endsWith(':large')) {
		return {
			redirectUrl: url.replace(/:large$/, ':orig')
		};
	}
}, {
	urls: ['https://pbs.twimg.com/media/*']
}, ['blocking']);

// Multiple Account Section

async function getAccount(sendResponse) {
	const authCookie = await browser.cookies.get({
		url: 'https://twitter.com',
		name: 'auth_token'
	});

	sendResponse({
		token: authCookie.value
	});
}

async function switchAccount(token) {
	await browser.cookies.set({
		url: 'https://twitter.com',
		name: 'auth_token',
		value: token,
		domain: '.twitter.com',
		path: '/',
		secure: true,
		httpOnly: true
	});

	await browser.cookies.remove({
		url: 'https://twitter.com',
		name: 'twid'
	});

	browser.tabs.getSelected(null, tab => {
		chrome.tabs.reload(tab.id);
	});
}

function removeToken() {
	browser.cookies.remove({
		url: 'https://twitter.com',
		name: 'auth_token'
	});
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	switch (request.message) {
		case 'requestAccessToken':
			getAccount(sendResponse);
			break;
		case 'setAccessToken':
			switchAccount(request.token);
			break;
		case 'removeAccessToken':
			removeToken();
			break;
		default:
			break;
	}
	return true;
});
