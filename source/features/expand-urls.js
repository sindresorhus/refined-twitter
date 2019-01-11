const refinedTwitterClass = 'refinedTwitterExpandedUrl'; //tag already expanded <a>

function removeUTMs(url) {
  const parsedURL = new URL(url);
  const urlWithOutUtms = parsedURL.href.replace(/[?&#]utm_.*/, '');
  return urlWithOutUtms
}

export default function () {
  const urls = $('a[data-expanded-url]:not(.' + refinedTwitterClass +')');
  for (const url of urls) {
    const expandedUrl = url.dataset.expandedUrl;
    const urlWithOutUtms = removeUTMs(expandedUrl);
    url.setAttribute('href', urlWithOutUtms);
    $(url).addClass(refinedTwitterClass);
  }
}
