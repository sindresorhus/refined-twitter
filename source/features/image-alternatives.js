import {h} from 'dom-chef';
import {safeElementReady} from '../libs/utils';

export default async () => {
	const imgContainers = document.querySelectorAll('.AdaptiveMedia > div > div > div');

	for (let i = 0; i < imgContainers.length; i++) {
		// Exit if it already exists
		if (document.querySelector('div.refined-twitter_alt')) {
			return;
		}

        var imgs = imgContainers[i].getElementsByTagName('img');
        for (let j = 0; j < imgs.length; j++) {
			let imgAlt = imgs[j].getAttribute('alt');

			if(imgAlt) {
				var altDiv = document.createElement('div');
				altDiv.className = 'refined-twitter_alt';
				altDiv.innerText = imgAlt,
				imgs[j].parentNode.insertBefore(altDiv, imgs[j].nextSibling)
			}
		}
	}
};
