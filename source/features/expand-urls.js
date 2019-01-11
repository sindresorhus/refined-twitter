const refinedTwitterClass = 'refinedTwitterExpandedUrl'; //tag already expanded <a>

function removeUTMs(url) {
  const parsedURL = new URL(url);
  return parsedURL.origin + parsedURL.pathname;
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
