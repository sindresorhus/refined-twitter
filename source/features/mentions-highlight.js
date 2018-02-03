import {getUsername} from '../libs/utils';

export default () => {
	const username = getUsername();

	if (username) {
		const mentions = document.querySelectorAll(`[data-has-parent-tweet=true][data-mentions*=${username}]:not(.refined-twitter-mention)`);

		for (const el of mentions) {
			el.classList.add('refined-twitter-mention');
		}
	}
};
