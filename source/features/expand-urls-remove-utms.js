function removeUTMs(url) {
	return url.replace(/[?&#]utm_.*/, '');
}

export default function () {
	const urls = $('a[data-expanded-url]');

	for (const el of urls) {
		const expandedUrl = el.getAttribute('data-expanded-url');
		const urlWithOutUtms = removeUTMs(expandedUrl);
		el.setAttribute('href', urlWithOutUtms);
	}
}
