export default function () {
	const anonymousAccount = Math.random() >= 0.5 ? 'Jane Doe' : 'John Doe';
	$('.FullNameGroup .fullname, .js-retweet-text b').text(anonymousAccount);
	$('.UserBadges, .username').hide();
	$('.avatar').attr('src', 'https://abs.twimg.com/sticky/default_profile_images/default_profile_4_bigger.png');
}
