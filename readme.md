# <img src="source/icon.png" width="45" align="left"> Refined Twitter

> Browser extension that simplifies the Twitter interface and adds useful features

We use Twitter a lot and notice many dumb annoyances we'd like to fix. So here be dragons.


*This is reusing the name from the [original Refined Twitter](https://github.com/sindresorhus/refined-twitter-old) project, which tried to use the mobile Twitter version on the desktop. It was a good idea in theory, but not in practise. This extension instead improves upon the desktop version of Twitter.*


## Install

- [**Chrome** extension](https://chrome.google.com/webstore/detail/refined-twitter/nlfgmdembofgodcemomfeimamihoknip)
- **Firefox** add-on: Use [this](https://addons.mozilla.org/en-US/firefox/addon/chrome-store-foxified/) to enable installing Chrome extensions and then install [Refined Twitter](https://chrome.google.com/webstore/detail/refined-twitter/nlfgmdembofgodcemomfeimamihoknip)
- **Opera** extension: Use [this](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/) to enable installing Chrome extensions and then install [Refined Twitter](https://chrome.google.com/webstore/detail/refined-twitter/nlfgmdembofgodcemomfeimamihoknip)


## Highlights

- Simplified and improved UI.
- Uses the system font (San Francisco on macOS).
- Improves the scrolling performance of twitter.com
- Auto-loads new tweets in the stream if you're scrolled to the top. No more clicking "See 3 new Tweets"!
- Replaces the Twitter emoji with native ones.
- Hides "Notifications" activity for new followers and being added to a list.

Tip: Twitter has a native [dark mode](https://github.com/sindresorhus/refined-twitter/issues/10).

<img src="media/screenshot.gif" width="1272">


## Customization

We're happy to receive suggestions and contributions, but be aware this is a highly opinionated project. There's a very high bar for adding options.

This doesn't necessarily limit you from manually disabling functionality that is not useful for you. Options include:

1. *(CSS Only)* Use a Chrome extension that allows injecting custom styles into sites, based on a URL pattern. [Stylish](https://chrome.google.com/webstore/detail/stylish/fjnbnpbmkenffdnngjfgmeleoegfcffe?hl=en) is one such tool. [Example](https://github.com/sindresorhus/refined-github/issues/136#issuecomment-204072018)

2. Clone the repository, make the adjustments you need, and [load the unpacked extension in Chrome](https://developer.chrome.com/extensions/getstarted#unpacked), rather than installing from the Chrome Store.


## Contribute

Suggestions and pull requests are highly encouraged!

In order to make modifications to the extension you'd need to run it locally.

Please follow the below steps:

```sh
git clone https://github.com/sindresorhus/refined-twitter
cd refined-twitter
npm install    # Install dev dependencies
npm run build  # Build the extension code so it's ready for the browser
npm run watch  # Listen for file changes and automatically rebuild
```

Once built, load it in the browser of your choice:

<table>
	<tr>
		<th>Chrome</th>
		<th>Firefox</th>
	</tr>
	<tr>
		<td width="50%">
			<ol>
				<li>Open <code>chrome://extensions</code>
				<li>Check the <strong>Developer mode</strong> checkbox
				<li>Click on the <strong>Load unpacked extension</strong> button
				<li>Select the folder <code>refined-twitter/extension</code>
			</ol>
		</td>
		<td width="50%">
			<ol>
				<li>Open <code>about:debugging#addons</code>
				<li>Click on the <strong>Load Temporary Add-on</strong> button
				<li>Select the file <code>refined-twitter/extension/manifest.json</code>
			</ol>
		</td>
	</tr>
</table>


## Related

- [Refined GitHub](https://github.com/sindresorhus/refined-github) - GitHub version of this extension


## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)


## License

MIT
