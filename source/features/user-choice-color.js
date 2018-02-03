export default () => {
	const html = document.getElementsByTagName('html');
	const newTweetButton = document.querySelector('#global-new-tweet-button');

	if (html && newTweetButton) {
		const bgColor = window.getComputedStyle(newTweetButton).backgroundColor;
		const userChoiceColorValues = /\((.*)\)/i.exec(bgColor)[1];

		html[0].style.setProperty('--refined-twitter_bgcolor-values', userChoiceColorValues);
	}
};
