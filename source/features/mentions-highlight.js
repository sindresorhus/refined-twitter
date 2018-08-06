import {getUsername} from '../libs/utils';

function saveUserColor() {
	const html = document.querySelector('html');
	const newTweetButton = document.querySelector('#global-new-tweet-button');

	if (html && newTweetButton) {
		const bgColor = window.getComputedStyle(newTweetButton).backgroundColor;
		const userChoiceColorValues = /\((.*)\)/i.exec(bgColor)[1];

		html.style.setProperty('--refined-twitter_bgcolor-values', userChoiceColorValues);
	}
}

export default function () {
	saveUserColor();

	const username = getUsername();
	const mentions = document.querySelectorAll(`[data-mentions*=${username}]:not(.refined-twitter_mention)`);

	for (const el of mentions) {
		el.classList.add('refined-twitter_mention');
	}
}
