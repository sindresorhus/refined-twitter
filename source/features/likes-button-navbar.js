import {h} from 'dom-chef';

export default () => {
	// Exit if it already exists
	if (document.querySelector('.refined-twitter_like-button')) {
		return;
	}

	$('#global-actions').append(
		<li>
			<a role="button" data-nav="favorites" href="/i/likes" class="js-nav js-tooltip js-dynamic-tooltip refined-like-button" data-placement="bottom">
				<span class="Icon Icon--heart Icon--large"></span>
				<span class="text">Likes</span>
			</a>
		</li>
	);
}
