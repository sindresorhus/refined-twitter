import domLoaded from 'dom-loaded';
import {observeEl, safeElementReady, safely} from './libs/utils';
import autoLoadNewTweets from './features/auto-load-new-tweets';
import inlineInstagramPhotos from './features/inline-instagram-photos';

function cleanNavbarDropdown() {
	$('#user-dropdown').find('[data-nav="all_moments"], [data-nav="ads"], [data-nav="promote-mode"], [data-nav="help_center"]').parent().hide();
}

function useNativeEmoji() {
	$('.Emoji--forText').replaceWith(function () {
		return $(this).attr('alt');
	});

	$('.Emoji--forLinks').replaceWith(function () {
		return $(this).siblings('span.visuallyhidden').text();
	});
}

function hideFollowersActivity() {
	$('#stream-items-id .js-activity-follow').hide();
}

function hideListAddActivity() {
	$('#stream-items-id .js-activity-list_member_added').hide();
}

function hideLikeTweets() {
	$('.tweet-context .Icon--heartBadge').parents('.js-stream-item').hide();
}

function inlineInstagramPosts() {
	$('a.twitter-timeline-link[data-expanded-url*="//www.instagram.com').each((idx, instagramAnchor) => {
		const tweetElement = $(instagramAnchor).parents('.js-tweet-text-container');
		// Don't do anything else if the image is already embedded
		if ($(tweetElement).siblings('.AdaptiveMedia').length > 0) {
			return true;
		}
		const instagramPostUrl = instagramAnchor.dataset.expandedUrl;
		const imageRegex = /"display_url": ?"([^"]+)"/g;
		fetchInstagramPhoto(instagramPostUrl)
			.then(postHtml => {
				const matches = imageRegex.exec(postHtml);
				const instagramImageUrl = matches[1] || null;
				if (instagramImageUrl) {
					insertInstagramPhotoInto(tweetElement, instagramImageUrl, instagramPostUrl);
				}
			});
	});
}

function insertInstagramPhotoInto(element, imageUrl, postUrl) {
	const tweetImageTemplate = `
	<div class="AdaptiveMedia">
		<a href="${postUrl}" target="_blank">
			<img class="refined-instagram-inline" src="${imageUrl}" />
		</a>
	</div>
	`;
	element.after(tweetImageTemplate);
}

async function fetchInstagramPhoto(postUrl) {
	const response = await fetch(postUrl);
	const html = response.text();
	return html;
}

async function init() {
	await safeElementReady('body');

	if (document.body.classList.contains('logged-out')) {
		return;
	}

	document.documentElement.classList.add('refined-twitter');

	await domLoaded;
	onDomReady();
}

function onRouteChange(cb) {
	observeEl('#doc', cb, {attributes: true});
}

function onNewTweets(cb) {
	observeEl('#stream-items-id', cb);
}

function onSingleTweetOpen(cb) {
	observeEl('body', mutations => {
		for (let i = 0; i < mutations.length; i++) {
			if (mutations[i].target.classList.contains('overlay-enabled')) {
				observeEl('#permalink-overlay', cb, {attributes: true, subtree: true});
				break;
			}
		}
	}, {attributes: true});
}

function onDomReady() {
	safely(cleanNavbarDropdown);

	onRouteChange(() => {
		safely(autoLoadNewTweets);

		onNewTweets(() => {
			safely(useNativeEmoji);
			safely(hideFollowersActivity);
			safely(hideListAddActivity);
			safely(hideLikeTweets);
			safely(inlineInstagramPhotos);
		});
	});

	onSingleTweetOpen(() => {
		safely(useNativeEmoji);
		safely(inlineInstagramPhotos);
	});
}

init();
