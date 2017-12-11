import {h} from 'dom-chef';

let instagramUrlsCollection = {};

function createPhotoElement(imageUrl, postUrl) {
	return <div class="AdaptiveMedia">
		<a href={`${postUrl}`} target="_blank" rel="noopener">
			<img class="refined-twitter_instagram-inline" src={`${imageUrl}`} />
		</a>
	</div>
}

async function downloadInstagramPhoto(postUrl) {
	instagramUrlsCollection[postUrl] = "";
	const imageRegex = /"display_url": ?"([^"]+)"/;
	const response = await fetch(postUrl);
	const html = await response.text();
	const matches = imageRegex.exec(html);
	const [, instagramImageUrl] = imageRegex.exec(html) || [];
	instagramUrlsCollection[postUrl] = instagramImageUrl;
	return instagramImageUrl;
}


export default function () {
	$('a.twitter-timeline-link[data-expanded-url*="//www.instagram.com').each(async (idx, instagramAnchor) => {
		const tweetElement = $(instagramAnchor).parents('.js-tweet-text-container');
		const instagramPostUrl = instagramAnchor.dataset.expandedUrl;
		const hasMediaSibling = (tweetElement.siblings('.AdaptiveMedia').length > 0);
		const hasImageDownload = (instagramUrlsCollection[instagramPostUrl] != undefined);
		let imageUrl = "";
		if (!hasImageDownload) {
			imageUrl = await downloadInstagramPhoto(instagramPostUrl);
		} else {
			imageUrl = instagramUrlsCollection[instagramPostUrl];
		}
		if (!hasMediaSibling) {
			const photoElement = createPhotoElement(imageUrl, instagramPostUrl);
			tweetElement.after(photoElement);
		}
	});
}
