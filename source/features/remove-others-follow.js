export default () => {
	const tweetContext = document.getElementsByClassName('tweet-context');

	for(const el of tweetContext) {
		el.style.display = "none";
	}
}