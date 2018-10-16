export default function () {
	$('.with-contextTweet')
		.filter(function (index) {
			return this.textContent.toLowerCase().indexOf('in case you missed') > -1
		})
		.hide();
}
