import ky from 'ky';

const refinedTwitterClass = 'refinedTwitterExpandedUrl';

async function getUnshortenUrl(shortURL) {
	const json = await ky.get('https://linkpeelr.appspot.com/api?action=peel_all&url=' +
	shortURL + '&where=twitter.com&version=2.0.3').json();

	return manageAPIResponse(json, shortURL);
}

// Linkpeelr API
function parseAPIResponse(apiResponse) {
	return apiResponse[1];
}

// Linkpeelr API
function isAPIResponseValid(apiResponse) {
	return apiResponse[0] === 301;
}

function manageAPIResponse(apiResponse, shortURL) {
	var output = shortURL;
	if (isAPIResponseValid(apiResponse)) {
		const apiURL = parseAPIResponse(apiResponse);
		output = apiURL;
	}

	return output;
}

/**
 * Remove http(s) and www from a URL
 **/
function removeHTTPAndWWW(string) {
	return string.replace('https://', '').replace('http://', '').replace('www.', '');
}

function setURL(url, htmlElement) {
	htmlElement.setAttribute('href', url);
}

function removeUTMs(url) {
	const parsedURL = new URL(url);
	const urlWithOutUTMs = parsedURL.href.replace(/[?&#]utm_.*/, '');

	return urlWithOutUTMs;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Example: https://twitter.com/polomarcus/status/955649699477950464
async function twitterCardURLs() {
	await sleep(2000); //	Iframes' content takes longer to load...
	//@TODO use jQuery load()
	const iframesToInspect = $('.js-macaw-cards-iframe-container iframe:not(.' + refinedTwitterClass + ')');
	console.log('iframes detected', iframesToInspect);

	for (const iframe of iframesToInspect) {
		$(iframe).addClass(refinedTwitterClass);
		const aHTMLTag = iframe.contentWindow.document.querySelector('a');
		const urlToExpand = aHTMLTag.getAttribute('href');
		const unShortenURL = getUnshortenUrl(urlToExpand, aHTMLTag);
		const urlWithOutUTMs = removeUTMs(unShortenURL);
		setURL(urlWithOutUTMs, aHTMLTag);
	}
}

async function getAllAPICall(aHTMLTags) {
	const results = [];
	for (const aHTMLTag of aHTMLTags) {

	}

	return Promise.all(results);
}

async function handleDisplayURL(aHTMLTag) {
	const {expandedUrl: urlToExpand} = aHTMLTag.dataset;
	const unShortenURL = await getUnshortenUrl(urlToExpand, aHTMLTag);
	const urlWithOutUTMs = removeUTMs(unShortenURL);
	setURL(urlWithOutUTMs, aHTMLTag);
	aHTMLTag.innerHTML = removeHTTPAndWWW(urlWithOutUTMs);
	$(aHTMLTag).addClass(refinedTwitterClass);
}

// Example: https://twitter.com/polomarcus/status/1083063057742471169
function displayURLs() {
	const aHTMLTags = $('a[data-expanded-url]:not(.' + refinedTwitterClass + ')');

	for (const aHTMLTag of aHTMLTags) {
		handleDisplayURL(aHTMLTag);
	}
}

export default function () {
	displayURLs();
	twitterCardURLs();
}
