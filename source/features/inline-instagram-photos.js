import {h} from 'dom-chef';

const instagramUrls = new Map();

function createPhotoElement(imageUrl, postUrl) {
	return (
		<div class="AdaptiveMedia">
			<a href={`${postUrl}`} target="_blank" rel="noopener">
				<img class="refined-twitter_instagram-inline" src={`${imageUrl}`} />
			</a>
		</div>
	);
}

function createPhotoContainer() {
	return <div class="AdaptiveMediaOuterContainer refined-twitter"></div>;
}

async function getInstagramPhotoUrl(postUrl) {
	const imageRegex = /"display_url": ?"([^"]+)"/;
	const response = await fetch(postUrl);
	const html = await response.text();
	const [, instagramImageUrl] = imageRegex.exec(html) || [];
	return instagramImageUrl;
}

export default function () {
	$('.twitter-timeline-link[data-expanded-url*="//www.instagram.com').each(async (idx, instagramAnchor) => {
		const tweetElement = $(instagramAnchor).parents('.js-tweet-text-container');
		const instagramPostUrl = instagramAnchor.dataset.expandedUrl;
		const shouldInlinePhoto = tweetElement.siblings('.AdaptiveMediaOuterContainer').length < 1;

		if (!shouldInlinePhoto) {
			return;
		}

		tweetElement.after(createPhotoContainer());

		let imageUrl = '';

		if (instagramUrls.has(instagramPostUrl)) {
			imageUrl = instagramUrls.get(instagramPostUrl);
		} else {
			imageUrl = await getInstagramPhotoUrl(instagramPostUrl);
			instagramUrls.set(instagramPostUrl, imageUrl);
		}

		const photoElement = createPhotoElement(imageUrl, instagramPostUrl);
		tweetElement.siblings('.AdaptiveMediaOuterContainer').html(photoElement);
	});
}
