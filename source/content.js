import domLoaded from 'dom-loaded';

import {
	enableFeature,
	observeEl,
	safeElementReady
} from './libs/utils';

import {autoInitFeatures, features} from './features';

async function init() {
	await safeElementReady('body');

	if (document.body.classList.contains('logged-out')) {
		return;
	}

	document.documentElement.classList.add('refined-twitter');

	for (const feature of autoInitFeatures) {
		enableFeature(Object.assign({}, feature, {fn: feature.fn || (() => {})}));
	}

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
			const {classList} = mutation.target;
			if (classList.contains('overlay-enabled')) {
				observeEl('#permalink-overlay', cb, {attributes: true, subtree: true});
				break;
			} else if (classList.contains('modal-enabled')) {
				observeEl('#global-tweet-dialog', cb, {attributes: true, subtree: true});
				break;
			}
		}
	}, {attributes: true});
}

function onGalleryItemOpen(cb) {
	observeEl('body', mutations => {
		for (const mutation of mutations) {
			if (mutation.target.classList.contains('gallery-enabled')) {
				observeEl('.Gallery-media', cb, {attributes: true, subtree: true});
				break;
			}
		}
	}, {attributes: true});
}

function onDomReady() {
	enableFeature(features.cleanNavbarDropdown);
	enableFeature(features.keyboardShortcuts);
	enableFeature(features.preserveTextMessages);

	onRouteChange(() => {
		enableFeature(features.autoLoadNewTweets);
		enableFeature(features.disableCustomColors);
		enableFeature(features.hideProfileHeader);

		onNewTweets(() => {
			enableFeature(features.codeHighlight);
			enableFeature(features.mentionHighlight);
			enableFeature(features.hideFollowTweets);
			enableFeature(features.hideLikeTweets);
			enableFeature(features.hideRetweets);
			enableFeature(features.hideRetweetButtons);
			enableFeature(features.hideNotificationsInCaseYouMissed);
			enableFeature(features.inlineInstagramPhotos);
			enableFeature(features.hidePromotedTweets);
			enableFeature(features.renderInlineCode);
			enableFeature(features.imageAlternatives);
		});
	});

	onSingleTweetOpen(() => {
		enableFeature(features.codeHighlight);
		enableFeature(features.mentionHighlight);
		enableFeature(features.inlineInstagramPhotos);
		enableFeature(features.renderInlineCode);
		enableFeature(features.imageAlternatives);
		enableFeature(features.hideRetweetButtons);
	});

	onGalleryItemOpen(() => {
		enableFeature(features.imageAlternatives);
	});
}

init();
