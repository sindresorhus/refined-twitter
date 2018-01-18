import domLoaded from 'dom-loaded';
import {observeEl, safeElementReady, safely} from './libs/utils';
import autoLoadNewTweets from './features/auto-load-new-tweets';
import inlineInstagramPhotos from './features/inline-instagram-photos';
import codeHighlight from './features/code-highlight';

function cleanNavbarDropdown() {
	$('#user-dropdown').find('[data-nav="all_moments"], [data-nav="ads"], [data-nav="promote-mode"], [data-nav="help_center"]').parent().hide();
}

function useNativeEmoji() {
	const emojiWrap = emoji => `<span class="Emoji refined-twitter_emoji">${emoji}</span>`;

	$('.Emoji--forText').replaceWith(function () {
		return emojiWrap($(this).attr('alt'));
	});

	$('.Emoji--forLinks').replaceWith(function () {
		const systemEmojiEl = $(this).next('span.visuallyhidden');
		const emojiText = systemEmojiEl.text();
		systemEmojiEl.remove();
		return emojiWrap(emojiText);
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

function hidePromotedTweets() {
	$('.promoted-tweet').parent().remove();
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
		for (const mutation of mutations) {
			if (mutation.target.classList.contains('overlay-enabled')) {
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
			safely(codeHighlight);
			safely(hideLikeTweets);
			safely(inlineInstagramPhotos);
			safely(hidePromotedTweets);
		});
	});

	onSingleTweetOpen(() => {
		safely(useNativeEmoji);
		safely(codeHighlight);
		safely(inlineInstagramPhotos);
	});
}

init();
