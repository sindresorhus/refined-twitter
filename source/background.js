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

browser.runtime.onMessage.addListener(request => {
	if (request.contentScriptQuery === 'getInstagramPhotoUrl') {
		const url = `https://instagram.com/p/${request.postID}`;
		return fetch(url).then(response => response.text());
	}
});
