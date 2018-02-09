import {observeEl, safely} from './libs/utils';
import autoLoadNewTweets from './features/auto-load-new-tweets';
import inlineInstagramPhotos from './features/inline-instagram-photos';
import userChoiceColor from './features/user-choice-color';
import codeHighlight from './features/code-highlight';
import mentionHighlight from './features/mentions-highlight';
import addLikesButtonNavBar from './features/likes-button-navbar';

function cleanNavbarDropdown() {
	$('#user-dropdown').find('[data-nav="all_moments"], [data-nav="ads"], [data-nav="promote-mode"], [data-nav="help_center"]').parent().hide();
}

function hideLikeTweets() {
	$('.tweet-context .Icon--heartBadge').parents('.js-stream-item').hide();
}

function hidePromotedTweets() {
	$('.promoted-tweet').parent().remove();
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

function init() {
	if (document.body.classList.contains('logged-out')) {
		return;
	}

	document.documentElement.classList.add('refined-twitter');

	safely(cleanNavbarDropdown);
	safely(addLikesButtonNavBar);

	onRouteChange(() => {
		safely(autoLoadNewTweets);
		safely(userChoiceColor);

		onNewTweets(() => {
			safely(codeHighlight);
			safely(mentionHighlight);
			safely(hideLikeTweets);
			safely(inlineInstagramPhotos);
			safely(hidePromotedTweets);
		});
	});

	onSingleTweetOpen(() => {
		safely(codeHighlight);
		safely(mentionHighlight);
		safely(inlineInstagramPhotos);
	});
}

init();
