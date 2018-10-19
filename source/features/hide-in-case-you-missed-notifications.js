export default function () {
	$('.with-contextTweet')
		.filter((index, tweet) => tweet.textContent.toLowerCase().includes('in case you missed'))
		.hide();
}
