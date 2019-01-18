import ky from 'ky';

const refinedTwitterClass = 'refinedTwitterExpandedUrl';

async function getUnshortenUrl(shortURL) {
	console.log("getUnshortenUrl " + shortURL);

	const json = await ky.get('https://linkpeelr.appspot.com/api?action=peel_all&url=' + shortURL + '&where=twitter.com&version=2.0.3',
		{mode:'no-cors'});

	return manageAPIResponse(json, shortURL);
}

//@TODO
function parseAPIResponse(apiReponse) {
	return ["TO", "DO"]
}

function isAPIReponseValid(apiCode) {
	return apiCode === '301';
}

async function manageAPIResponse(apiReponse, shortURL) {
	console.log("ky response always status 0", apiReponse);
	console.log("shortURL", shortURL);
	if(isAPIReponseValid(apiReponse.status)) {
		const apiReponseParsed = parseAPIResponse(apiReponse);
		const apiURL = apiReponseParsed[1];
		const apiCode = apiReponseParsed[0];
		const realURL= cleanAPIURL(apiURL);
		realURL = replaceBackSlash(realURL);
		return realURL;
	} else {
		return shortURL;
	}
}

function removeUTMs(url) {
	const parsedURL = new URL(url);
	const urlWithOutUtms = parsedURL.href.replace(/[?&#]utm_.*/, '');
	return urlWithOutUtms;
}

export default async function () {
	const urls = $('a[data-expanded-url]:not(.' + refinedTwitterClass + ')');
	for (const url of urls) {
		const {expandedUrl: urlToExpand} = url.dataset;
		const unshortenUrl = await getUnshortenUrl(urlToExpand)
		const urlWithOutUtms = removeUTMs(unshortenUrl);
		url.setAttribute('href', urlWithOutUtms);
		$(url).addClass(refinedTwitterClass);
	}
}
