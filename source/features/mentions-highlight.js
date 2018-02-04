import {getUsername} from '../libs/utils';

export default () => {
	const username = getUsername();
	const mentions = document.querySelectorAll(`[data-mentions*=${username}]:not(.refined-twitter_mention)`);

	for (const el of mentions) {
		el.classList.add('refined-twitter_mention');
	}
};
