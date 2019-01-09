function removeUTMs(url){
  if(url.indexOf('utm') !== -1) {
    return url.replace(/[?&]utm_.*/,'');
  } else {
    return url;
  }
}

function expandUrl(item) {
	item.attr("href", el.attr('data-expanded-url'));
}


export default function () {
	const urls = $('a[data-expanded-url]');

	for (const el of urls) { //for(var i = 0; i < allShortLinks.length; i++){
		console.error("ça marche???");

		const expandedUrl = el.getAttribute("data-expanded-url");
		const urlWithOutUtms = removeUTMs(expandedUrl);
		el.setAttribute("href", urlWithOutUtms);
	}
}
