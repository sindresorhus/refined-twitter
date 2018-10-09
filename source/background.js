import OptionsSync from 'webext-options-sync';

// Define defaults
new OptionsSync().define({
	defaults: {},
	migrations: [
		OptionsSync.migrations.removeUnused
	]
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

function getAccount(sendResponse) {
	chrome.cookies.get({
		url: 'https://twitter.com',
		name: 'auth_token'
	}, cookie => {
		sendResponse({
			token: cookie.value
		});
	});
}

function rmToken() {
	chrome.cookies.remove({
		url: 'https://twitter.com',
		name: 'auth_token'
	});
}

function switchAccount(token) {
	chrome.cookies.set({
		url: 'https://twitter.com',
		name: 'auth_token',
		value: token,
		domain: '.twitter.com',
		path: '/',
		secure: true,
		httpOnly: true
	});

	chrome.cookies.remove({
		url: 'https://twitter.com',
		name: 'twid'
	});

	chrome.tabs.getSelected(null, tab => {
		chrome.tabs.reload(tab.id);
	});
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	switch (request.message) {
		case 'reqAccessToken':
			getAccount(sendResponse);
			break;
		case 'setAccessToken':
			switchAccount(request.token);
			break;
		case 'rmAccessToken':
			rmToken();
			break;
		default:
			break;
	}
	return true;
});
