import {getUsername} from '../libs/utils';

export default function () {
	const username = getUsername();

	if (username) {
		const mentions = document.querySelectorAll(`[data-has-parent-tweet=true][data-mentions*=${username}]:not(.refined-twitter-mention)`);
		mentions.forEach(e => {
			e.classList.add('refined-twitter-mention');
		});
	}
}
