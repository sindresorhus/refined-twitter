import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';

export const features = {
	/* GENERAL */
	keyboardShortcuts: {
		id: 'feature-keyboard-shortcuts',
		category: 'general',
		label: 'Enable keyboard shortcut to toggle Night Mode (Alt + M)',
		fn: require('./keyboard-shortcuts').default,
		hidden: true
	},
	preserveTextMessages: {
		id: 'feature-preserve-text-messages',
		category: 'general',
		label: 'Preserve unsent text in the Messages modal when it closes',
		fn: require('./preserve-text-messages').default
	},
	useSystemFont: {
		id: 'feature-use-system-font',
		category: 'general',
		label: 'Use the system font',
		runOnInit: true
	},

	/* HEADER */
	addLikesButtonNavBar: {
		id: 'feature-likes-button-navbar',
		category: 'header',
		label: 'Add "Likes" tab',
		fn: require('./likes-button-navbar').default,
		runOnInit: true
	},
	cleanNavbarDropdown: {
		id: 'feature-clean-navbar-dropdown',
		category: 'header',
		label: 'Cleanup navbar dropdown',
		fn: require('./clean-navbar-dropdown').default,
		hidden: true
	},
	cleanupSearchSuggestions: {
		id: 'feature-cleanup-search-suggestions',
		category: 'header',
		label: 'Remove hashtags suggestions in the search popover',
		runOnInit: true,
		hidden: true
	},
	hideMomentsTab: {
		id: 'feature-hide-moments-tab',
		category: 'header',
		label: 'Hide "Moments" tab',
		runOnInit: true
	},
	hideTwitterLogo: {
		id: 'feature-hide-twitter-logo',
		category: 'header',
		label: 'Hide Twitter bird logo',
		runOnInit: true,
		hidden: true
	},

	/* HOME */
	hideHomeFooterCard: {
		id: 'feature-home-hide-footer-card',
		category: 'home',
		label: 'Hide "Footer" Card',
		runOnInit: true,
		hidden: true
	},
	hideHomeProfileCard: {
		id: 'feature-home-hide-profile-card',
		category: 'home',
		label: 'Hide "Profile" Card',
		runOnInit: true
	},
	hideHomeTrendsCard: {
		id: 'feature-home-hide-trends-card',
		category: 'home',
		label: 'Hide "Trends" Card',
		runOnInit: true
	},
	hideHomeWhoToFollowCard: {
		id: 'feature-home-hide-who-to-follow-card',
		category: 'home',
		label: 'Hide "Who to follow" Card',
		runOnInit: true
	},

	/* NOTIFICATIONS */
	hideNotificationsFollowActivity: {
		id: 'feature-notifications-hide-follow-activity',
		category: 'notifications',
		label: 'Hide "Followed you" activity',
		runOnInit: true
	},
	hideNotificationsListActivity: {
		id: 'feature-notifications-hide-list-activity',
		category: 'notifications',
		label: 'Hide "Added you to a list" activity',
		runOnInit: true
	},
	hideNotificationsLikedReplyActivity: {
		id: 'feature-notifications-hide-liked-reply-activity',
		category: 'notifications',
		label: 'Hide "Liked a reply to you" activity',
		runOnInit: true
	},
	hideNotificationsInCaseYouMissed: {
		id: 'feature-notifications-in-case-you-missed-activity',
		category: 'notifications',
		label: 'Hide "In case you missed" activity',
		fn: require('./hide-in-case-you-missed-notifications').default
	},

	/* PROFILE */
	hideProfileHeader: {
		id: 'feature-remove-profile-header',
		category: 'profile',
		label: 'Hide the header image on profile pages',
		fn: require('./remove-profile-header').default
	},
	disableCustomColors: {
		id: 'feature-disable-custom-colors',
		category: 'profile',
		label: 'Use your personal color theme on all profiles',
		fn: require('./disable-custom-colors').default
	},

	/* TIMELINE */
	autoLoadNewTweets: {
		id: 'feature-auto-load-new-tweets',
		category: 'timeline',
		label: 'Auto-loads new tweets in the stream if you\'re scrolled to the top',
		fn: require('./auto-load-new-tweets').default
	},
	codeHighlight: {
		id: 'feature-code-highlight',
		category: 'timeline',
		label: 'Syntax highlighting in code blocks',
		fn: require('./code-highlight').default
	},
	hideFollowTweets: {
		id: 'feature-hide-follow-tweets',
		category: 'timeline',
		label: 'Hide "And others follow" tweets in the stream',
		fn: require('./hide-follow-tweets').default
	},
	hideLikeTweets: {
		id: 'feature-hide-like-tweets',
		category: 'timeline',
		label: 'Hide "Liked" tweets in the stream',
		fn: require('./hide-like-tweets').default
	},
	hideRetweets: {
		id: 'feature-hide-retweets',
		category: 'timeline',
		label: 'Hide retweets in the stream',
		enabledByDefault: false,
		fn: require('./hide-retweets').default
	},
	hidePromotedTweets: {
		id: 'feature-hide-promoted-tweets',
		category: 'timeline',
		label: 'Hide promoted tweets',
		fn: require('./hide-promoted-tweets').default
	},
	hideRetweetButtons: {
		id: 'feature-hide-retweet-buttons',
		category: 'timeline',
		label: 'Hide retweet buttons',
		enabledByDefault: false,
		fn: require('./hide-retweet-buttons').default
	},
	imageAlternatives: {
		id: 'feature-image-alternatives',
		category: 'timeline',
		label: 'Shows alternative image text below images when available',
		fn: require('./image-alternatives').default
	},
	inlineInstagramPhotos: {
		id: 'feature-inline-instagram-photos',
		category: 'timeline',
		label: 'Embed the photo from Instagram links directly in the tweet',
		fn: require('./inline-instagram-photos').default,
		hidden: true
	},
	mentionHighlight: {
		id: 'feature-mentions-highlight',
		category: 'timeline',
		label: 'Highlight your mentions in the stream',
		fn: require('./mentions-highlight').default
	},
	renderInlineCode: {
		id: 'feature-inline-code',
		category: 'timeline',
		label: 'Adds Markdown-like styling of text wrapped in backticks',
		fn: require('./inline-code').default
	}
};

export const featuresArr = sortBy(Object.values(features), ['category', 'label']);

export const groupedFeatures = groupBy(featuresArr, 'category');

export const autoInitFeatures = featuresArr.filter(feature => feature.runOnInit);

const _featuresDefaultValues = {};
for (const feature of featuresArr) {
	_featuresDefaultValues[feature.id] =
		typeof feature.enabledByDefault === 'boolean' ? feature.enabledByDefault : true;
}

export const featuresDefaultValues = _featuresDefaultValues;
