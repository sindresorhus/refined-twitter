import ky from 'ky';

const refinedTwitterClass = 'refinedTwitterExpandedUrl';

function getUnshortenUrl(element, shortURL) {
	let xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === XMLHttpRequest.DONE ) {
			if(xmlhttp.status === 200){
				manageAPIResponse(element, xmlhttp.responseText);
			}
		}
	}

	xmlhttp.open('GET', 'https://linkpeelr.appspot.com/api?action=peel_all&url=' + shortURL + '&where=twitter.com&version=2.0.3', true);
	xmlhttp.send();
}

function parseAPIResponse(apiReponse) {
	console.log("apiReponse", apiReponse)
	return apiReponse;
}

function isAPIReponseValid(apiCode) {
	return apiCode === '301';
}

function manageAPIResponse(apiReponse, shortURL) {
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
	console.log("removeUTMS", url);
	const parsedURL = new URL(url);
	const urlWithOutUtms = parsedURL.href.replace(/[?&#]utm_.*/, '');
	return urlWithOutUtms;
}

export default async function () {
	const urls = $('a[data-expanded-url]:not(.' + refinedTwitterClass + ')');
	for (const url of urls) {
		const {expandedUrl: urlToExpand} = url.dataset;
		const unshortenUrl = await getUnshortenUrl(urlToExpand);
//		const urlWithOutUtms = removeUTMs(unshortenUrl);
		const urlWithOutUtms = "test"
		url.setAttribute('href', urlWithOutUtms);
		$(url).addClass(refinedTwitterClass);
	}
}
