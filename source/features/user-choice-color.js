export default function () {
	const html = document.getElementsByTagName('html');
	const newTweetButton = document.getElementById('global-new-tweet-button');

	if (html && newTweetButton) {
		const bgColor = window.getComputedStyle(newTweetButton).backgroundColor;
		const userChoiceColorValues = bgColor.match(/\((.*)\)/i)[1];

		html[0].style.setProperty('--bgcolor-values', userChoiceColorValues);
	}
}
