import {h} from 'dom-chef';

const instagramUrls = new Map();

function createPhotoElement(imageUrl, postUrl) {
	return <div class="AdaptiveMediaOuterContainer">
			<div class="AdaptiveMedia">
				<a href={`${postUrl}`} target="_blank" rel="noopener">
					<img class="refined-twitter_instagram-inline" src={`${imageUrl}`} />
				</a>
			</div>
		</div>;
}

async function getInstagramPhotoUrl(postUrl) {
	const imageRegex = /"display_url": ?"([^"]+)"/;
	const response = await fetch(postUrl);
	const html = await response.text();
	const [, instagramImageUrl] = imageRegex.exec(html) || [];
	return instagramImageUrl;
}

export default function () {
	$('a.twitter-timeline-link[data-expanded-url*="//www.instagram.com').each(async (idx, instagramAnchor) => {
		const tweetElement = $(instagramAnchor).parents('.js-tweet-text-container');
		const instagramPostUrl = instagramAnchor.dataset.expandedUrl;
		const shouldInlinePhoto = tweetElement.attr('data-refined-twitter-inlined-instagram') === undefined;
		if (shouldInlinePhoto) {
			tweetElement.attr('data-refined-twitter-inlined-instagram', 'waiting');
		} else {
			return;
		}
		let imageUrl = '';
		if (instagramUrls.has(instagramPostUrl) === false) {
			imageUrl = await getInstagramPhotoUrl(instagramPostUrl);
			instagramUrls.set(instagramPostUrl, imageUrl);
		} else {
			imageUrl = instagramUrls.get(instagramPostUrl);
		}
		if (shouldInlinePhoto) {
			const photoElement = createPhotoElement(imageUrl, instagramPostUrl);
			tweetElement.after(photoElement);
			tweetElement.attr('data-refined-twitter-inlined-instagram', 'done');
		}
	});
}
