

function removeUTMs(url) {
	return url.replace(/[?&#]utm_.*/, '');
}

export default function () {
	const refinedTwitterClass = 'refinedTwitterExpandedUrl'; //tag already expanded <a>
	const urls = $('a[data-expanded-url]:not(.' + refinedTwitterClass +')');
	for (const url of urls) {
		const expandedUrl = url.getAttribute('data-expanded-url');
		const urlWithOutUtms = removeUTMs(expandedUrl);
		url.setAttribute('href', urlWithOutUtms);
		$(url).addClass(refinedTwitterClass);
	}
}
