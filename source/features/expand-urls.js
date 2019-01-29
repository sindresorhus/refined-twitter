import ky from 'ky';

const refinedTwitterClass = 'refinedTwitterExpandedUrl';

async function getUnshortenUrl(shortURL) {
	const json = await ky.get('https://linkpeelr.appspot.com/api?action=peel_all&url='
	+ shortURL + '&where=twitter.com&version=2.0.3').json();

	return manageAPIResponse(json, shortURL);
}

// linkpeelr API
function parseAPIResponse(apiResponse) {
	return apiResponse[1];
}

// linkpeelr API
function isAPIResponseValid(apiResponse) {
	return apiResponse[0] === 301;
}

function manageAPIResponse(apiResponse, shortURL) {
	if (isAPIResponseValid(apiResponse)) {
		const apiURL = parseAPIResponse(apiResponse);
		return apiURL;
	} else {
		return shortURL;
	}
}

/**
 * remove http(s) and www from a URL
 **/
function removeHTTPAndWWW(string){
  return string.replace('https://', '').replace('http://', '').replace('www.', '');
}

function setURL(url, htmlElement) {
	let urlWithOutUTMs = removeUTMs(url);
	htmlElement.setAttribute('href', urlWithOutUTMs);
	htmlElement.innerHTML = removeHTTPAndWWW(urlWithOutUTMs);
	$(htmlElement).addClass(refinedTwitterClass);
}

function removeUTMs(url) {
	const parsedURL = new URL(url);
	const urlWithOutUTMs = parsedURL.href.replace(/[?&#]utm_.*/, '');

	return urlWithOutUTMs;
}

//@TODO
function twitterCard(htmlElement) {
	const urlToExpand = $('.card-type-summary_large_image iframe')[0].contentWindow.document.querySelector('a')
}

export default async function () {
	const aHTMLTags = $('a[data-expanded-url]:not(.' + refinedTwitterClass + ')');

	for (const aHTMLTag of aHTMLTags) {
		const {expandedUrl: urlToExpand} = aHTMLTag.dataset;
		const unShortenURL = await getUnshortenUrl(urlToExpand, aHTMLTag);
		setURL(unShortenURL, aHTMLTag);
	}
}
