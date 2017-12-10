import domLoaded from 'dom-loaded';
import {observeEl, safeElementReady, safely} from './libs/utils';
import autoLoadNewTweets from './features/auto-load-new-tweets';

function cleanNavbarDropdown() {
	$('#user-dropdown').find('[data-nav="all_moments"], [data-nav="ads"], [data-nav="promote-mode"], [data-nav="help_center"]').parent().remove();
}

function useNativeEmoji() {
	$('#stream-items-id .Emoji--forText').replaceWith(function () {
		return $(this).attr('alt');
	});
}

function hideFollowersActivity() {
	$('#stream-items-id .js-activity-follow').css('display', 'none');
}

function hideListAddActivity() {
	$('#stream-items-id .js-activity-list_member_added').css('display', 'none');
}

function useOriginalImageInGallery() {
	$('.media-image[src$=":large"]').each(function () {
		$(this).attr('src', $(this).attr('src').replace(/:large$/, ':orig'));
	});
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

function onGalleryOpen(cb) {
	observeEl('.Gallery-media', cb, {attributes: true});
}

function onDomReady() {
	safely(cleanNavbarDropdown);

	onRouteChange(() => {
		safely(autoLoadNewTweets);

		onNewTweets(() => {
			safely(useNativeEmoji);
			safely(hideFollowersActivity);
			safely(hideListAddActivity);
		});

		onGalleryOpen(() => {
			safely(useOriginalImageInGallery);
		});
	});
}

init();
