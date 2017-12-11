import {h} from 'dom-chef';

const instagramUrlsCollection = {};

function createPhotoElement(imageUrl, postUrl) {
	return <div class="AdaptiveMediaOuterContainer">
			<div class="AdaptiveMedia">
				<a href={`${postUrl}`} target="_blank" rel="noopener">
					<img class="refined-twitter_instagram-inline" src={`${imageUrl}`} />
				</a>
			</div>
		</div>;
}

async function downloadInstagramPhoto(postUrl) {
	instagramUrlsCollection[postUrl] = '';
	const imageRegex = /"display_url": ?"([^"]+)"/;
	const response = await fetch(postUrl);
	const html = await response.text();
	const [, instagramImageUrl] = imageRegex.exec(html) || [];
	instagramUrlsCollection[postUrl] = instagramImageUrl;
	return instagramImageUrl;
}

export default function () {
	$('a.twitter-timeline-link[data-expanded-url*="//www.instagram.com').each(async (idx, instagramAnchor) => {
		const tweetElement = $(instagramAnchor).parents('.js-tweet-text-container');
		const instagramPostUrl = instagramAnchor.dataset.expandedUrl;
		const hasMediaSibling = (tweetElement.siblings('.AdaptiveMediaOuterContainer').length > 0);
		const hasImageDownload = (instagramUrlsCollection[instagramPostUrl] !== undefined);
		let imageUrl = '';
		if (hasImageDownload === false) {
			imageUrl = await downloadInstagramPhoto(instagramPostUrl);
		} else {
			imageUrl = instagramUrlsCollection[instagramPostUrl];
		}
		if (hasMediaSibling === false) {
			const photoElement = createPhotoElement(imageUrl, instagramPostUrl);
			tweetElement.after(photoElement);
		}
	});
}
