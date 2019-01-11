const refinedTwitterClass = 'refinedTwitterExpandedUrl'; //tag already expanded <a>

function removeUTMs(url) {
  return url.replace(/[?&#]utm_.*/, '');
}

export default function () {
  const urls = $('a[data-expanded-url]:not(.' + refinedTwitterClass +')');
  for (const url of urls) {
    const expandedUrl = url.dataset.expandedUrl;
    const urlWithOutUtms = removeUTMs(expandedUrl);
    url.dataset.href = urlWithOutUtms;
    $(url).addClass(refinedTwitterClass);
  }
}
