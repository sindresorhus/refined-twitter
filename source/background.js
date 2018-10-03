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

/*---------------------------------*\
	  # Req the access token #
\*---------------------------------*/

chrome.runtime.onMessage.addListener(
	function (request, _, sendResponse) {
		if (request.message == "reqAccessToken") {
			const options = {
				url: "https://twitter.com",
				name: "auth_token"
			}

			chrome.cookies.get(options, function (response) {
				sendResponse({
					key: response.name,
					token: response.value
				});
			});
		}
		return true;
	}
);

/*---------------------------------*\
	  # Set the access token #
\*---------------------------------*/

chrome.runtime.onMessage.addListener(
	function (request, _, sendResponse) {
		if (request.message == "setAccessToken") {
			console.log(request.cookieValue)
			const options = {
				url: "https://twitter.com",
				name: "auth_token",
				value: request.cookieValue,
				// expirationDate: 30000,
				secure: true,
				httpOnly: true
			}
			chrome.cookies.remove({url: "https://twitter.com", name: "auth_token"})
			chrome.cookies.set(options, function () {
				chrome.tabs.reload();
				// sendResponse(authCookie);
			});
		}
		return true;
	}
);
