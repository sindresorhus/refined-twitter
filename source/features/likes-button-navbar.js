import {h} from 'dom-chef';
import {safeElementReady} from '../libs/utils';

export default async function () {
	const navBar = await safeElementReady('#global-actions');

	// Exit if it already exists
	if (document.querySelector('.refined-twitter_like-button')) {
		return;
	}

	navBar.append(
		<li>
			<a role="button" data-nav="favorites" href="/i/likes" class="js-nav js-tooltip js-dynamic-tooltip refined-twitter_like-button" data-placement="bottom">
				<span class="Icon Icon--heart Icon--large"></span>
				<span class="text">Likes</span>
			</a>
		</li>
	);
}
