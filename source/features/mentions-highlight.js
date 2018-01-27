import { getUsername } from '../libs/utils';

export default function () {
	const username = getUsername();

	if (username) {
		const mentions = document.querySelectorAll(`[data-has-parent-tweet=true][data-mentions*=${username}]:not(.mention4me)`);
		mentions.forEach((e,i) => {
			e.classList.add('mention4me')
		})
	}
}
