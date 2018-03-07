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

// https://stackoverflow.com/a/20856789/5106072
browser.runtime.onInstalled.addListener(() => {
	browser.declarativeContent.onPageChanged.removeRules(undefined, () => {
		browser.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new browser.declarativeContent.PageStateMatcher({
					pageUrl: {
						hostEquals: 'twitter.com',
						schemes: ['https']
					}
				})
			],
			actions: [new browser.declarativeContent.ShowPageAction()]
		}]);
	});
});